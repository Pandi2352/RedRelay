import { registerAs } from '@nestjs/config';
import { getEnv } from './env.schema';

export const authConfig = registerAs('auth', () => {
  const env = getEnv();
  return {
    jwtAccessSecret: env.JWT_ACCESS_SECRET,
    jwtAccessExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
    jwtRefreshSecret: env.JWT_REFRESH_SECRET,
    jwtRefreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  };
});
