import type { INestApplication } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { configureApp } from './common/bootstrap';
import { appConfig } from './config';

export const UNPREFIXED_ROUTES = ['health'];

/** Applies RedRelay's config to the generic bootstrap helpers. Used by main.ts and e2e tests. */
export function setupApp(app: INestApplication): ConfigType<typeof appConfig> {
  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
  configureApp(app, {
    apiPrefix: config.apiPrefix,
    corsOrigins: config.corsOrigins,
    unprefixedRoutes: UNPREFIXED_ROUTES,
  });
  return config;
}
