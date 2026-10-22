import request from 'supertest';
import type { App } from 'supertest/types';
import { createTestApp, type TestApp } from './utils/create-test-app';

describe('Hospitals (e2e)', () => {
  let testApp: TestApp;

  beforeAll(async () => {
    testApp = await createTestApp();
  });

  afterAll(async () => {
    await testApp.close();
  });

  const validHospitalPayload = {
    name: 'Apollo Speciality Hospital',
    type: 'hospital',
    address: 'Greams Road, Thousand Lights, Chennai',
    location: {
      type: 'Point',
      coordinates: [80.2514, 13.0604],
    },
    contactPhone: '+91 44 2829 0200',
  };

  let createdId: string;

  it('POST /api/v1/hospitals creates a new hospital', async () => {
    const res = await request(testApp.app.getHttpServer() as App)
      .post('/api/v1/hospitals')
      .send(validHospitalPayload)
      .expect(201);

    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toMatchObject({
      name: validHospitalPayload.name,
      type: validHospitalPayload.type,
      address: validHospitalPayload.address,
      contactPhone: validHospitalPayload.contactPhone,
      location: validHospitalPayload.location,
      verification: {
        status: 'pending',
        documents: [],
      },
    });
    expect(res.body.data.id).toBeDefined();
    createdId = res.body.data.id;
  });

  it('POST /api/v1/hospitals fails with 400 on invalid payload', async () => {
    const res = await request(testApp.app.getHttpServer() as App)
      .post('/api/v1/hospitals')
      .send({ name: '' })
      .expect(400);

    expect(res.body).toMatchObject({
      error: {
        code: 'VALIDATION_FAILED',
      },
    });
  });

  it('GET /api/v1/hospitals lists hospitals with pagination', async () => {
    const res = await request(testApp.app.getHttpServer() as App)
      .get('/api/v1/hospitals?page=1&limit=10')
      .expect(200);

    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('meta');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.meta).toMatchObject({
      page: 1,
      limit: 10,
    });
  });

  it('GET /api/v1/hospitals/:id returns the hospital by id', async () => {
    const res = await request(testApp.app.getHttpServer() as App)
      .get(`/api/v1/hospitals/${createdId}`)
      .expect(200);

    expect(res.body.data).toMatchObject({
      id: createdId,
      name: validHospitalPayload.name,
    });
  });

  it('PATCH /api/v1/hospitals/:id updates hospital fields and verification', async () => {
    const res = await request(testApp.app.getHttpServer() as App)
      .patch(`/api/v1/hospitals/${createdId}`)
      .send({
        name: 'Apollo Main Hospital',
        verification: { status: 'verified', note: 'Medical registration checked.' },
      })
      .expect(200);

    expect(res.body.data).toMatchObject({
      id: createdId,
      name: 'Apollo Main Hospital',
      verification: {
        status: 'verified',
        note: 'Medical registration checked.',
      },
    });
  });

  it('DELETE /api/v1/hospitals/:id removes the hospital', async () => {
    await request(testApp.app.getHttpServer() as App)
      .delete(`/api/v1/hospitals/${createdId}`)
      .expect(204);

    await request(testApp.app.getHttpServer() as App)
      .get(`/api/v1/hospitals/${createdId}`)
      .expect(404);
  });
});
