import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const SWAGGER_PATH = 'docs';

interface SwaggerOptions {
  title: string;
  description: string;
  version: string;
}

/** Swagger UI at /docs and JSON at /docs-json (the frontend generates its API types from it). */
export function setupSwagger(app: INestApplication, options: SwaggerOptions): void {
  const config = new DocumentBuilder()
    .setTitle(options.title)
    .setDescription(options.description)
    .setVersion(options.version)
    .addBearerAuth()
    .addCookieAuth('refresh_token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PATH, app, document, { jsonDocumentUrl: `${SWAGGER_PATH}-json` });
}
