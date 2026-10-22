import { appConfig } from './app.config';
import { authConfig } from './auth.config';
import { databaseConfig } from './database.config';
import { redisConfig } from './redis.config';

export { appConfig, authConfig, databaseConfig, redisConfig };
export { validateEnv, type Env } from './env.schema';

export const configNamespaces = [appConfig, authConfig, databaseConfig, redisConfig];
