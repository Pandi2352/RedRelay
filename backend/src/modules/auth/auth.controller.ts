import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { CookieOptions, Request, Response } from 'express';
import { HTTP_STATUS } from '../../common/constants';
import {
  ApiEnvelopedResponse,
  ApiStandardErrors,
  CurrentUser,
  Public,
} from '../../common/decorators';
import type { AuthUser } from '../../common/types';
import { appConfig } from '../../config';
import { AuthService } from './auth.service';
import {
  AuthResponseDto,
  LoginDto,
  RefreshResponseDto,
  RegisterDto,
  UserProfileDto,
} from './dto';

const REFRESH_COOKIE = 'refresh_token';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(appConfig.KEY) private readonly appCfg: ConfigType<typeof appConfig>,
  ) {}

  private get cookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: this.appCfg.isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiEnvelopedResponse(AuthResponseDto, { status: HTTP_STATUS.CREATED })
  @ApiStandardErrors()
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const result = await this.authService.register(dto);
    res.cookie(REFRESH_COOKIE, result.refreshToken, this.cookieOptions);
    return { user: result.user, accessToken: result.accessToken };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiEnvelopedResponse(AuthResponseDto)
  @ApiStandardErrors()
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const result = await this.authService.login(dto);
    res.cookie(REFRESH_COOKIE, result.refreshToken, this.cookieOptions);
    return { user: result.user, accessToken: result.accessToken };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiEnvelopedResponse(RefreshResponseDto)
  @ApiStandardErrors()
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RefreshResponseDto> {
    const token = (req.cookies as Record<string, string> | undefined)?.[REFRESH_COOKIE];
    const newTokens = await this.authService.refresh(token ?? '');
    res.cookie(REFRESH_COOKIE, newTokens.refreshToken, this.cookieOptions);
    return { accessToken: newTokens.accessToken };
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiStandardErrors()
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const token = (req.cookies as Record<string, string> | undefined)?.[REFRESH_COOKIE];
    if (token) {
      try {
        const payload = await this.authService.refresh(token);
        // Clean database state
        await this.authService.logout(payload.accessToken);
      } catch {
        // Ignore if expired
      }
    }
    res.clearCookie(REFRESH_COOKIE, { path: '/' });
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  @ApiBearerAuth('jwt')
  @ApiEnvelopedResponse(UserProfileDto)
  @ApiStandardErrors()
  getProfile(@CurrentUser() user: AuthUser): UserProfileDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: 'active',
    };
  }
}
