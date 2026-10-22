import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const SWAGGER_PATH = 'docs';

export interface SwaggerOptions {
  title?: string;
  description?: string;
  version?: string;
  contactName?: string;
  contactUrl?: string;
}

export const DEFAULT_SWAGGER_OPTIONS: Required<SwaggerOptions> = {
  title: 'RedRelay API',
  description: 'Real-time emergency blood donor network REST API',
  version: '0.1.0',
  contactName: 'RedRelay Engineering',
  contactUrl: 'https://github.com/Pandi2352/RedRelay',
};

/**
 * Common Swagger bootstrap configuring OpenAPI documentation at /docs and JSON schema at /docs-json.
 */
export function setupSwagger(app: INestApplication, options: SwaggerOptions = {}): void {
  const merged = { ...DEFAULT_SWAGGER_OPTIONS, ...options };

  const config = new DocumentBuilder()
    .setTitle(merged.title)
    .setDescription(merged.description)
    .setVersion(merged.version)
    .setContact(merged.contactName, merged.contactUrl, '')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your access token',
      },
      'bearer',
    )
    .addCookieAuth('refresh_token', {
      type: 'apiKey',
      in: 'cookie',
      description: 'Rotating refresh token cookie',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(SWAGGER_PATH, app, document, {
    jsonDocumentUrl: `${SWAGGER_PATH}-json`,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
    },
  });
}
