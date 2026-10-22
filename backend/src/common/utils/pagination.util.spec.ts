import { createPaginatedResult, isPaginatedResult, toSkip } from './pagination.util';

describe('pagination utils', () => {
  it('computes skip from page and limit', () => {
    expect(toSkip({ page: 3, limit: 20 })).toBe(40);
  });

  it('builds meta with total pages rounded up', () => {
    const result = createPaginatedResult(['a', 'b'], { page: 1, limit: 2 }, 5);
    expect(result.meta).toEqual({ page: 1, limit: 2, total: 5, totalPages: 3 });
  });

  it('recognises paginated results only', () => {
    expect(isPaginatedResult(createPaginatedResult([], { page: 1, limit: 10 }, 0))).toBe(true);
    expect(isPaginatedResult({ items: 'nope' })).toBe(false);
    expect(isPaginatedResult(null)).toBe(false);
  });
});
