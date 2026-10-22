export interface ErrorDetail {
  field?: string;
  message: string;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details: ErrorDetail[];
    requestId?: string;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** What services return for list endpoints; the envelope interceptor turns it into { data, meta }. */
export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}
