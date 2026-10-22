import type { ConfigType } from '@nestjs/config';
import type { JwtService } from '@nestjs/jwt';
import { AppException } from '../../../common/exceptions/app.exception';
import { Role } from '../../../common/types';
import { hashPassword } from '../../../common/utils';
import type { authConfig } from '../../../config';
import { AuthService } from '../auth.service';
import type { UsersService } from '../../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let mockUsersService: {
    findByEmail: jest.Mock;
    findById: jest.Mock;
    create: jest.Mock;
    updateRefreshTokenHash: jest.Mock;
  };
  let mockJwtService: {
    signAsync: jest.Mock;
    verifyAsync: jest.Mock;
  };
  const mockConfig: ConfigType<typeof authConfig> = {
    jwtAccessSecret: 'test-access-secret',
    jwtAccessExpiresIn: '15m',
    jwtRefreshSecret: 'test-refresh-secret',
    jwtRefreshExpiresIn: '7d',
  };

  beforeEach(() => {
    mockUsersService = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      updateRefreshTokenHash: jest.fn().mockResolvedValue(undefined),
    };
    mockJwtService = {
      signAsync: jest.fn().mockImplementation((_payload: unknown, opts?: { secret?: string }) => {
        return Promise.resolve(
          opts?.secret === 'test-access-secret' ? 'mock-access-token' : 'mock-refresh-token',
        );
      }),
      verifyAsync: jest.fn(),
    };

    service = new AuthService(
      mockUsersService as unknown as UsersService,
      mockJwtService as unknown as JwtService,
      mockConfig,
    );
  });

  describe('register', () => {
    it('creates a new user and returns access + refresh tokens', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue({
        id: 'user-uuid-1',
        email: 'donor@example.com',
        name: 'Sarah',
        role: Role.Donor,
        status: 'active',
      });

      const res = await service.register({
        email: 'donor@example.com',
        password: 'Password123!',
        name: 'Sarah',
      });

      expect(res.user.email).toBe('donor@example.com');
      expect(res.accessToken).toBe('mock-access-token');
      expect(res.refreshToken).toBe('mock-refresh-token');
      expect(mockUsersService.updateRefreshTokenHash).toHaveBeenCalled();
    });

    it('throws 409 Conflict if email is already registered', async () => {
      mockUsersService.findByEmail.mockResolvedValue({ id: 'existing-id' });

      await expect(
        service.register({
          email: 'donor@example.com',
          password: 'Password123!',
          name: 'Sarah',
        }),
      ).rejects.toThrow(AppException);
    });
  });

  describe('login', () => {
    it('authenticates valid credentials and issues tokens', async () => {
      const hashed = await hashPassword('Password123!');
      mockUsersService.findByEmail.mockResolvedValue({
        id: 'user-uuid-1',
        email: 'donor@example.com',
        passwordHash: hashed,
        name: 'Sarah',
        role: Role.Donor,
        status: 'active',
      });

      const res = await service.login({
        email: 'donor@example.com',
        password: 'Password123!',
      });

      expect(res.accessToken).toBe('mock-access-token');
      expect(res.user.id).toBe('user-uuid-1');
    });

    it('rejects invalid password with 401 Unauthorized', async () => {
      const hashed = await hashPassword('RealPassword');
      mockUsersService.findByEmail.mockResolvedValue({
        id: 'user-uuid-1',
        email: 'donor@example.com',
        passwordHash: hashed,
        status: 'active',
      });

      await expect(
        service.login({
          email: 'donor@example.com',
          password: 'WrongPassword',
        }),
      ).rejects.toThrow(AppException);
    });
  });

  describe('refresh', () => {
    it('rotates tokens successfully', async () => {
      const currentRefreshToken = 'valid-token';
      const currentHash = await hashPassword(currentRefreshToken);

      mockJwtService.verifyAsync.mockResolvedValue({ sub: 'user-uuid-1' });
      mockUsersService.findById.mockResolvedValue({
        id: 'user-uuid-1',
        email: 'donor@example.com',
        name: 'Sarah',
        role: Role.Donor,
        status: 'active',
        refreshTokenHash: currentHash,
      });

      const tokens = await service.refresh(currentRefreshToken);
      expect(tokens.accessToken).toBe('mock-access-token');
      expect(mockUsersService.updateRefreshTokenHash).toHaveBeenCalled();
    });

    it('detects token reuse, revokes session, and throws 401', async () => {
      const oldUsedToken = 'old-token';
      const currentActiveHash = await hashPassword('new-different-token');

      mockJwtService.verifyAsync.mockResolvedValue({ sub: 'user-uuid-1' });
      mockUsersService.findById.mockResolvedValue({
        id: 'user-uuid-1',
        status: 'active',
        refreshTokenHash: currentActiveHash,
      });

      await expect(service.refresh(oldUsedToken)).rejects.toThrow(AppException);
      expect(mockUsersService.updateRefreshTokenHash).toHaveBeenCalledWith('user-uuid-1', null);
    });
  });
});
