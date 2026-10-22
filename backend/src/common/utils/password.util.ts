import { hash, verify } from '@node-rs/argon2';

/**
 * Hashes a plain password using Argon2id with cryptographically secure parameters.
 */
export async function hashPassword(plain: string): Promise<string> {
  return hash(plain);
}

/**
 * Verifies a plain password against an Argon2id hash.
 */
export async function verifyPassword(hashed: string, plain: string): Promise<boolean> {
  try {
    return await verify(hashed, plain);
  } catch {
    return false;
  }
}
