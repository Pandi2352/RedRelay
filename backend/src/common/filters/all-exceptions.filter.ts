import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ERROR_CODE_BY_STATUS, ERROR_CODES } from '../constants';
import { AppException } from '../exceptions/app.exception';
import type { ApiErrorBody } from '../types';

/** Converts every thrown error into the standard { error: { code, message, details, requestId } } body. */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const request = http.getRequest<Request & { id?: string | number }>();
    const response = http.getResponse<Response>();

    const status: number =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const body: ApiErrorBody = {
      error: {
        ...this.describe(exception, status),
        requestId: request.id === undefined ? undefined : String(request.id),
      },
    };

    if (status >= 500) {
      this.logger.error(exception instanceof Error ? exception.stack : exception);
    }
    response.status(status).json(body);
  }

  private describe(exception: unknown, status: number): Omit<ApiErrorBody['error'], 'requestId'> {
    if (exception instanceof AppException) {
      return { code: exception.code, message: exception.message, details: exception.details };
    }
    if (exception instanceof HttpException) {
      return {
        code: ERROR_CODE_BY_STATUS[status] ?? ERROR_CODES.INTERNAL_ERROR,
        message: exception.message,
        details: [],
      };
    }
    return { code: ERROR_CODES.INTERNAL_ERROR, message: 'Something went wrong on our side.', details: [] };
  }
}
