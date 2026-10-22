import type { PaginatedResult } from '../types';

export interface PageRequest {
  page: number;
  limit: number;
}

export function toSkip({ page, limit }: PageRequest): number {
  return (page - 1) * limit;
}

export function createPaginatedResult<T>(
  items: T[],
  { page, limit }: PageRequest,
  total: number,
): PaginatedResult<T> {
  return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export function isPaginatedResult(value: unknown): value is PaginatedResult<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray((value as PaginatedResult<unknown>).items) &&
    typeof (value as PaginatedResult<unknown>).meta === 'object'
  );
}
