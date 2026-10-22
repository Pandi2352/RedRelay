import { HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { ERROR_CODES } from '../constants';
import { AppException } from '../exceptions/app.exception';

/** Rejects route params that are not valid Mongo ObjectIds before they reach a query. */
@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!isValidObjectId(value)) {
      throw new AppException(HttpStatus.BAD_REQUEST, ERROR_CODES.VALIDATION_FAILED, 'Invalid id.', [
        { message: `"${value}" is not a valid id` },
      ]);
    }
    return value;
  }
}
