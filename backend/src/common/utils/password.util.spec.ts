import { hashPassword, verifyPassword } from './password.util';

describe('password.util', () => {
  it('hashes plain text into valid argon2 hash and verifies correctly', async () => {
    const plain = 'P@ssw0rdSecure!2026';
    const hashed = await hashPassword(plain);

    expect(typeof hashed).toBe('string');
    expect(hashed.startsWith('$argon2')).toBe(true);

    const valid = await verifyPassword(hashed, plain);
    expect(valid).toBe(true);

    const invalid = await verifyPassword(hashed, 'wrong-password');
    expect(invalid).toBe(false);
  });
});
