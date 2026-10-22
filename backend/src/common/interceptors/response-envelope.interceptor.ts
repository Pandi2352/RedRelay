import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, type Observable } from 'rxjs';
import { isPaginatedResult } from '../utils/pagination.util';

/** Wraps handler results as { data } or, for paginated results, { data, meta }. */
@Injectable()
export class ResponseEnvelopeInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> {
    return next
      .handle()
      .pipe(
        map((result) =>
          isPaginatedResult(result) ? { data: result.items, meta: result.meta } : { data: result ?? null },
        ),
      );
  }
}
