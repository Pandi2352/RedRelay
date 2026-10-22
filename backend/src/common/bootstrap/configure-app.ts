import type { INestApplication } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';

export interface ConfigureAppOptions {
  apiPrefix: string;
  corsOrigins: string[];
  /** Routes served without the API prefix, e.g. ['health'] */
  unprefixedRoutes?: string[];
}

/** HTTP-level setup shared by main.ts and e2e tests. */
export function configureApp(app: INestApplication, options: ConfigureAppOptions): void {
  app.useLogger(app.get(Logger));
  (app as NestExpressApplication).set('trust proxy', 1);
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({ origin: options.corsOrigins, credentials: true });
  app.setGlobalPrefix(options.apiPrefix, { exclude: options.unprefixedRoutes ?? [] });
  app.enableShutdownHooks();
}
