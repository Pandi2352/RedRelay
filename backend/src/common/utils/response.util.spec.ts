import { createErrorEnvelope, createSuccessEnvelope } from './response.util';

describe('response.util', () => {
  describe('createSuccessEnvelope', () => {
    it('creates envelope without meta', () => {
      const res = createSuccessEnvelope({ id: '123' });
      expect(res).toEqual({ data: { id: '123' } });
    });

    it('creates envelope with pagination meta', () => {
      const meta = { page: 1, limit: 10, total: 100, totalPages: 10 };
      const res = createSuccessEnvelope([{ id: '1' }], meta);
      expect(res).toEqual({ data: [{ id: '1' }], meta });
    });
  });

  describe('createErrorEnvelope', () => {
    it('creates uniform error structure with ISO timestamp', () => {
      const err = createErrorEnvelope('NOT_FOUND', 'Item missing', [{ field: 'id', message: 'invalid' }], 'req-99');
      expect(err.error).toMatchObject({
        code: 'NOT_FOUND',
        message: 'Item missing',
        details: [{ field: 'id', message: 'invalid' }],
        requestId: 'req-99',
      });
      expect(typeof err.error.timestamp).toBe('string');
      expect(!isNaN(Date.parse(err.error.timestamp!))).toBe(true);
    });
  });
});
