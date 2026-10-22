import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';
import type { ApiErrorBody } from '../types';

const FALLBACK_MESSAGE = 'Something went wrong. Try again.';
const NETWORK_MESSAGE = 'Can’t reach the server. Check your connection and try again.';

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return typeof value === 'object' && value !== null && 'error' in value;
}

/** Turns any RTK Query error into one sentence the user can act on. */
export function getErrorMessage(error: FetchBaseQueryError | SerializedError | undefined): string {
  if (!error) return FALLBACK_MESSAGE;
  if ('status' in error) {
    if (error.status === 'FETCH_ERROR' || error.status === 'TIMEOUT_ERROR') return NETWORK_MESSAGE;
    if (isApiErrorBody(error.data)) return error.data.error.message;
    return FALLBACK_MESSAGE;
  }
  return error.message ?? FALLBACK_MESSAGE;
}
