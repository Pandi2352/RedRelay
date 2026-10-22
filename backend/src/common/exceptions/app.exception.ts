import { HttpException, HttpStatus } from '@nestjs/common';
import type { ErrorDetail } from '../types';

/** Throw this for any error the client should be able to handle by its code. */
export class AppException extends HttpException {
  constructor(
    status: HttpStatus,
    readonly code: string,
    message: string,
    readonly details: ErrorDetail[] = [],
  ) {
    super(message, status);
  }
}
