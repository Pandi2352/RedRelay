import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp } from './app.setup';
import { setupSwagger } from './common/bootstrap';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = setupApp(app);

  if (!config.isProduction) {
    setupSwagger(app, {
      title: 'RedRelay API',
      description: 'Real-time emergency blood donor network',
      version: '0.1.0',
    });
  }

  await app.listen(config.port);
}

void bootstrap();
