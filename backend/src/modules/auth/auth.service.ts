import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AppException } from '../../common/exceptions/app.exception';
import type { JwtPayload, Role } from '../../common/types';
import { hashPassword, verifyPassword } from '../../common/utils';
import { authConfig } from '../../config';
import { UsersService } from '../users/users.service';
import type { AuthResponseDto, LoginDto, RegisterDto, UserProfileDto } from './dto';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(authConfig.KEY)
    private readonly config: ConfigType<typeof authConfig>,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto & { refreshToken: string }> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new AppException(
        HttpStatus.CONFLICT,
        'EMAIL_ALREADY_EXISTS',
        'A user with this email address already exists',
      );
    }

    const passwordHash = await hashPassword(dto.password);
    const user = await this.usersService.create({
      email: dto.email,
      passwordHash,
      name: dto.name,
      role: dto.role,
      phone: dto.phone,
      status: 'active',
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role, user.name);
    await this.saveRefreshTokenHash(user.id, tokens.refreshToken);

    return {
      user: this.toProfileDto(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto & { refreshToken: string }> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !user.passwordHash || user.status !== 'active') {
      throw new AppException(
        HttpStatus.UNAUTHORIZED,
        'INVALID_CREDENTIALS',
        'Invalid email or password',
      );
    }

    const isValid = await verifyPassword(user.passwordHash, dto.password);
    if (!isValid) {
      throw new AppException(
        HttpStatus.UNAUTHORIZED,
        'INVALID_CREDENTIALS',
        'Invalid email or password',
      );
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role, user.name);
    await this.saveRefreshTokenHash(user.id, tokens.refreshToken);

    return {
      user: this.toProfileDto(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.config.jwtRefreshSecret,
      });
    } catch {
      throw new AppException(
        HttpStatus.UNAUTHORIZED,
        'INVALID_REFRESH_TOKEN',
        'Invalid or expired refresh token',
      );
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.refreshTokenHash || user.status !== 'active') {
      throw new AppException(
        HttpStatus.UNAUTHORIZED,
        'SESSION_EXPIRED',
        'Session has expired. Please log in again.',
      );
    }

    const matches = await verifyPassword(user.refreshTokenHash, refreshToken);
    if (!matches) {
      // Reuse detection: clear saved token to invalidate any hijacked sessions
      await this.usersService.updateRefreshTokenHash(user.id, null);
      throw new AppException(
        HttpStatus.UNAUTHORIZED,
        'REFRESH_TOKEN_REUSED',
        'Security alert: token reuse detected. All sessions have been revoked.',
      );
    }

    const newTokens = await this.generateTokens(user.id, user.email, user.role, user.name);
    await this.saveRefreshTokenHash(user.id, newTokens.refreshToken);

    return newTokens;
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.updateRefreshTokenHash(userId, null);
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: Role,
    name: string,
  ): Promise<AuthTokens> {
    const payload: JwtPayload = { sub: userId, email, role, name };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.jwtAccessSecret,
        expiresIn: this.config.jwtAccessExpiresIn as never,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.jwtRefreshSecret,
        expiresIn: this.config.jwtRefreshExpiresIn as never,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async saveRefreshTokenHash(userId: string, token: string): Promise<void> {
    const hash = await hashPassword(token);
    await this.usersService.updateRefreshTokenHash(userId, hash);
  }

  private toProfileDto(user: { id: string; email: string; name: string; role: Role; status: string }): UserProfileDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
    };
  }
}
