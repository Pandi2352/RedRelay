import request from 'supertest';
import type { App } from 'supertest/types';
import type { HospitalResponseDto } from '../src/modules/hospitals/dto/hospital-response.dto';
import { createTestApp, type TestApp } from './utils/create-test-app';

interface EnvelopedData<T> {
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

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

  let createdId = '';

  it('POST /api/v1/hospitals creates a new hospital', async () => {
    const res = await request(testApp.app.getHttpServer() as App)
      .post('/api/v1/hospitals')
      .send(validHospitalPayload)
      .expect(201);

    const body = res.body as EnvelopedData<HospitalResponseDto>;
    expect(body).toHaveProperty('data');
    expect(body.data).toMatchObject({
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
    expect(body.data.id).toBeDefined();
    createdId = body.data.id;
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

    const body = res.body as EnvelopedData<HospitalResponseDto[]>;
    expect(body).toHaveProperty('data');
    expect(body).toHaveProperty('meta');
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThanOrEqual(1);
    expect(body.meta).toMatchObject({
      page: 1,
      limit: 10,
    });
  });

  it('GET /api/v1/hospitals/:id returns the hospital by id', async () => {
    const res = await request(testApp.app.getHttpServer() as App)
      .get(`/api/v1/hospitals/${createdId}`)
      .expect(200);

    const body = res.body as EnvelopedData<HospitalResponseDto>;
    expect(body.data).toMatchObject({
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

    const body = res.body as EnvelopedData<HospitalResponseDto>;
    expect(body.data).toMatchObject({
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
