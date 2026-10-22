import { validateEnv } from './env.schema';

const validEnv = {
  MONGODB_URI: 'mongodb://localhost:27017/test',
  REDIS_URL: 'redis://localhost:6379',
};

describe('validateEnv', () => {
  it('applies defaults and coerces numbers', () => {
    const env = validateEnv({ ...validEnv, PORT: '4000' });
    expect(env.PORT).toBe(4000);
    expect(env.NODE_ENV).toBe('development');
    expect(env.API_PREFIX).toBe('api/v1');
  });

  it('throws a readable error when required values are missing', () => {
    expect(() => validateEnv({})).toThrow(/MONGODB_URI/);
  });
});
