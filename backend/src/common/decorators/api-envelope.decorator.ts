import { applyDecorators, HttpStatus, type Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginationMetaDto } from '../dto';

interface EnvelopeOptions {
  status?: HttpStatus;
  isArray?: boolean;
  description?: string;
}

/** Documents a `{ data: Model }` (or `{ data: Model[] }`) response so generated client types match the envelope. */
export function ApiEnvelopedResponse(model: Type<unknown>, options: EnvelopeOptions = {}) {
  const ref = { $ref: getSchemaPath(model) };
  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      status: options.status ?? HttpStatus.OK,
      description: options.description,
      schema: {
        type: 'object',
        required: ['data'],
        properties: { data: options.isArray ? { type: 'array', items: ref } : ref },
      },
    }),
  );
}

/** Documents a `{ data: Model[], meta: PaginationMeta }` response. */
export function ApiPaginatedResponse(model: Type<unknown>) {
  return applyDecorators(
    ApiExtraModels(model, PaginationMetaDto),
    ApiResponse({
      status: HttpStatus.OK,
      schema: {
        type: 'object',
        required: ['data', 'meta'],
        properties: {
          data: { type: 'array', items: { $ref: getSchemaPath(model) } },
          meta: { $ref: getSchemaPath(PaginationMetaDto) },
        },
      },
    }),
  );
}
