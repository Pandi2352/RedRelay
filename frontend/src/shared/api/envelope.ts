import type { ApiEnvelope } from '../types';

/** Use as `transformResponse: unwrapData` on single-resource endpoints. */
export function unwrapData<T>(response: ApiEnvelope<T>): T {
  return response.data;
}
