import type { ApiEnvelope, ApiErrorBody, ErrorDetail, PaginationMeta } from '../types';

/**
 * Standard utility function to wrap success payloads into a uniform API envelope.
 */
export function createSuccessEnvelope<T>(data: T, meta?: PaginationMeta): ApiEnvelope<T> {
  return meta !== undefined ? { data, meta } : { data };
}

/**
 * Standard utility function to format errors into the uniform API error structure.
 */
export function createErrorEnvelope(
  code: string,
  message: string,
  details: ErrorDetail[] = [],
  requestId?: string,
): ApiErrorBody {
  return {
    error: {
      code,
      message,
      details,
      requestId,
      timestamp: new Date().toISOString(),
    },
  };
}
