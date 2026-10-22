/** Mirrors the backend envelope (backend/src/common/types/api-response.types.ts). */
export interface ApiEnvelope<T> {
  data: T;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedEnvelope<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details: { field?: string; message: string }[];
    requestId?: string;
  };
}
