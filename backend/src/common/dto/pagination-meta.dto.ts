import type { PaginationMeta } from '../types';

export class PaginationMetaDto implements PaginationMeta {
  page!: number;
  limit!: number;
  total!: number;
  totalPages!: number;
}
