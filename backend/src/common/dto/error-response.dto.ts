import type { ApiErrorBody, ErrorDetail } from '../types';

export class ErrorDetailDto implements ErrorDetail {
  field?: string;
  message!: string;
}

export class ErrorBodyDto {
  /** Machine-readable code, e.g. VALIDATION_FAILED */
  code!: string;
  message!: string;
  details!: ErrorDetailDto[];
  requestId?: string;
}

export class ErrorResponseDto implements ApiErrorBody {
  error!: ErrorBodyDto;
}
