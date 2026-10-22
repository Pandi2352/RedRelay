import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, type Observable } from 'rxjs';
import { isPaginatedResult } from '../utils/pagination.util';

import { createSuccessEnvelope } from '../utils/response.util';

/** Wraps handler results into the uniform { data, meta? } envelope. */
@Injectable()
export class ResponseEnvelopeInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> {
    return next
      .handle()
      .pipe(
        map((result) =>
          isPaginatedResult(result)
            ? createSuccessEnvelope(result.items, result.meta)
            : createSuccessEnvelope(result ?? null),
        ),
      );
  }
}
