import { v4 as uuidv4, validate as validateUuid } from 'uuid';

/** Generates a cryptographically secure RFC 4122 UUID v4 string using the uuid library. */
export function generateUuid(): string {
  return uuidv4();
}

/** Validates whether a given value is a valid UUID string using the uuid library. */
export function isValidUuid(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  return validateUuid(value);
}
