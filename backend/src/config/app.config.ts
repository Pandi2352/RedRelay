import { registerAs } from '@nestjs/config';
import { getEnv } from './env.schema';

export const appConfig = registerAs('app', () => {
  const env = getEnv();
  return {
    env: env.NODE_ENV,
    isProduction: env.NODE_ENV === 'production',
    port: env.PORT,
    apiPrefix: env.API_PREFIX,
    corsOrigins: env.CORS_ORIGINS.split(',').map((origin) => origin.trim()),
    logLevel: env.LOG_LEVEL,
  };
});
