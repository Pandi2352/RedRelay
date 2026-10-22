import { appConfig } from './app.config';
import { databaseConfig } from './database.config';
import { redisConfig } from './redis.config';

export { appConfig, databaseConfig, redisConfig };
export { validateEnv, type Env } from './env.schema';

export const configNamespaces = [appConfig, databaseConfig, redisConfig];
