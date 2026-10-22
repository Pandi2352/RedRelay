import { registerAs } from '@nestjs/config';
import { getEnv } from './env.schema';

export const redisConfig = registerAs('redis', () => ({
  url: getEnv().REDIS_URL,
}));
