import { HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { ERROR_CODES } from '../constants';
import { AppException } from '../exceptions/app.exception';
import { isValidUuid } from '../utils/uuid.util';

/** Validates that a route parameter is a valid UUID before it reaches a query. */
@Injectable()
export class ParseUuidPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!isValidUuid(value)) {
      throw new AppException(HttpStatus.BAD_REQUEST, ERROR_CODES.VALIDATION_FAILED, 'Invalid UUID.', [
        { message: `"${value}" is not a valid UUID` },
      ]);
    }
    return value;
  }
}
