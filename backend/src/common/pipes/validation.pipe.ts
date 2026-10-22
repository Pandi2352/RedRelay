import { HttpStatus, ValidationError, ValidationPipe } from '@nestjs/common';
import { ERROR_CODES } from '../constants';
import { AppException } from '../exceptions/app.exception';
import type { ErrorDetail } from '../types';

function flatten(errors: ValidationError[], parent = ''): ErrorDetail[] {
  return errors.flatMap((error) => {
    const field = parent ? `${parent}.${error.property}` : error.property;
    const own = Object.values(error.constraints ?? {}).map((message) => ({ field, message }));
    return [...own, ...flatten(error.children ?? [], field)];
  });
}

/** Global validation: strips unknown fields, rejects extras, transforms types, standard error body. */
export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) =>
      new AppException(
        HttpStatus.BAD_REQUEST,
        ERROR_CODES.VALIDATION_FAILED,
        'Some fields are invalid.',
        flatten(errors),
      ),
  });
}
