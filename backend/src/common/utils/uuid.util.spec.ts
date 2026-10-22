import { generateUuid, isValidUuid } from './uuid.util';

describe('uuid.util', () => {
  it('generates a valid UUID string', () => {
    const id = generateUuid();
    expect(typeof id).toBe('string');
    expect(isValidUuid(id)).toBe(true);
  });

  it('generates distinct UUIDs', () => {
    const id1 = generateUuid();
    const id2 = generateUuid();
    expect(id1).not.toBe(id2);
  });

  it('rejects invalid or non-UUID inputs', () => {
    expect(isValidUuid('')).toBe(false);
    expect(isValidUuid('not-a-uuid')).toBe(false);
    expect(isValidUuid('6717a66b9319808a287c8e91')).toBe(false); // MongoDB ObjectId is not a UUID
    expect(isValidUuid(12345)).toBe(false);
    expect(isValidUuid(null)).toBe(false);
    expect(isValidUuid(undefined)).toBe(false);
  });
});
