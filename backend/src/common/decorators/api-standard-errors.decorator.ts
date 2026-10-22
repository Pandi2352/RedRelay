import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ErrorResponseDto } from '../dto';

const DEFAULT_ERROR_STATUSES = [
  HttpStatus.BAD_REQUEST,
  HttpStatus.UNAUTHORIZED,
  HttpStatus.FORBIDDEN,
  HttpStatus.NOT_FOUND,
  HttpStatus.INTERNAL_SERVER_ERROR,
];

/** Documents the standard error body for the given statuses (defaults to the common set). */
export function ApiStandardErrors(statuses: HttpStatus[] = DEFAULT_ERROR_STATUSES) {
  return applyDecorators(...statuses.map((status) => ApiResponse({ status, type: ErrorResponseDto })));
}
