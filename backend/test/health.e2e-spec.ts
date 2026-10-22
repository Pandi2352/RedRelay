import request from 'supertest';
import type { App } from 'supertest/types';
import { createTestApp, type TestApp } from './utils/create-test-app';

describe('Health (e2e)', () => {
  let testApp: TestApp;

  beforeAll(async () => {
    testApp = await createTestApp();
  });

  afterAll(async () => {
    await testApp.close();
  });

  it('GET /health returns the enveloped status with the database up', async () => {
    const res = await request(testApp.app.getHttpServer() as App)
      .get('/health')
      .expect(200);

    expect(res.body).toMatchObject({ data: { status: 'ok', database: 'up' } });
  });

  it('unknown routes return the standard error body', async () => {
    const res = await request(testApp.app.getHttpServer() as App)
      .get('/api/v1/nope')
      .expect(404);

    expect(res.body).toMatchObject({ error: { code: 'NOT_FOUND', details: [] } });
  });
});
