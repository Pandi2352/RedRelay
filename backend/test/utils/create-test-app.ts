import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { startTestMongo } from '../../src/common/testing/mongo-memory';

export interface TestApp {
  app: INestApplication;
  close: () => Promise<void>;
}

/** Boots the full AppModule against an in-memory Mongo. Env is set before the app is imported. */
export async function createTestApp(): Promise<TestApp> {
  const mongo = await startTestMongo();
  process.env.NODE_ENV = 'test';
  process.env.LOG_LEVEL = 'error';
  process.env.MONGODB_URI = mongo.uri;
  process.env.REDIS_URL ??= 'redis://localhost:6379';

  const { AppModule } = await import('../../src/app.module');
  const { setupApp } = await import('../../src/app.setup');

  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = moduleRef.createNestApplication({ bufferLogs: true });
  setupApp(app);
  await app.init();

  return {
    app,
    close: async () => {
      await app.close();
      await mongo.stop();
    },
  };
}
