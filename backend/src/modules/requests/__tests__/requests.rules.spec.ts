import { HttpStatus } from '@nestjs/common';
import { AppException } from '../../../common';
import { REQUEST_ERROR_CODES, REQUEST_STATUSES } from '../requests.constants';
import {
  assertTransition,
  assertValidDeadline,
  calculateStatusAfterConfirmation,
  canTransition,
  isTerminalStatus,
} from '../requests.rules';

describe('requests.rules', () => {
  describe('canTransition and assertTransition', () => {
    it('allows all legal transitions from open', () => {
      expect(canTransition(REQUEST_STATUSES.OPEN, REQUEST_STATUSES.PARTIALLY_MATCHED)).toBe(true);
      expect(canTransition(REQUEST_STATUSES.OPEN, REQUEST_STATUSES.FULFILLED)).toBe(true);
      expect(canTransition(REQUEST_STATUSES.OPEN, REQUEST_STATUSES.EXPIRED)).toBe(true);
      expect(canTransition(REQUEST_STATUSES.OPEN, REQUEST_STATUSES.CANCELLED)).toBe(true);
      expect(canTransition(REQUEST_STATUSES.OPEN, REQUEST_STATUSES.OPEN)).toBe(true);
    });

    it('allows legal transitions from partially_matched', () => {
      expect(canTransition(REQUEST_STATUSES.PARTIALLY_MATCHED, REQUEST_STATUSES.FULFILLED)).toBe(true);
      expect(canTransition(REQUEST_STATUSES.PARTIALLY_MATCHED, REQUEST_STATUSES.EXPIRED)).toBe(true);
      expect(canTransition(REQUEST_STATUSES.PARTIALLY_MATCHED, REQUEST_STATUSES.CANCELLED)).toBe(true);
    });

    it('rejects backward transitions', () => {
      expect(canTransition(REQUEST_STATUSES.PARTIALLY_MATCHED, REQUEST_STATUSES.OPEN)).toBe(false);
      expect(canTransition(REQUEST_STATUSES.FULFILLED, REQUEST_STATUSES.OPEN)).toBe(false);
      expect(canTransition(REQUEST_STATUSES.CANCELLED, REQUEST_STATUSES.OPEN)).toBe(false);
      expect(canTransition(REQUEST_STATUSES.EXPIRED, REQUEST_STATUSES.PARTIALLY_MATCHED)).toBe(false);
    });

    it('assertTransition throws 409 Conflict for illegal transitions', () => {
      expect(() =>
        assertTransition(REQUEST_STATUSES.FULFILLED, REQUEST_STATUSES.OPEN),
      ).toThrow(AppException);

      try {
        assertTransition(REQUEST_STATUSES.FULFILLED, REQUEST_STATUSES.OPEN);
      } catch (err: unknown) {
        expect(err).toBeInstanceOf(AppException);
        const appErr = err as AppException;
        expect(appErr.getStatus()).toBe(HttpStatus.CONFLICT);
        expect(appErr.code).toBe(REQUEST_ERROR_CODES.INVALID_TRANSITION);
      }
    });

    it('assertTransition does not throw for legal transition', () => {
      expect(() =>
        assertTransition(REQUEST_STATUSES.OPEN, REQUEST_STATUSES.PARTIALLY_MATCHED),
      ).not.toThrow();
    });
  });

  describe('isTerminalStatus', () => {
    it('identifies terminal and non-terminal states correctly', () => {
      expect(isTerminalStatus(REQUEST_STATUSES.OPEN)).toBe(false);
      expect(isTerminalStatus(REQUEST_STATUSES.PARTIALLY_MATCHED)).toBe(false);
      expect(isTerminalStatus(REQUEST_STATUSES.FULFILLED)).toBe(true);
      expect(isTerminalStatus(REQUEST_STATUSES.EXPIRED)).toBe(true);
      expect(isTerminalStatus(REQUEST_STATUSES.CANCELLED)).toBe(true);
    });
  });

  describe('calculateStatusAfterConfirmation', () => {
    it('returns open when 0 units confirmed', () => {
      expect(calculateStatusAfterConfirmation(0, 3)).toBe(REQUEST_STATUSES.OPEN);
    });

    it('returns partially_matched when some units confirmed', () => {
      expect(calculateStatusAfterConfirmation(1, 3)).toBe(REQUEST_STATUSES.PARTIALLY_MATCHED);
      expect(calculateStatusAfterConfirmation(2, 3)).toBe(REQUEST_STATUSES.PARTIALLY_MATCHED);
    });

    it('returns fulfilled when all units confirmed', () => {
      expect(calculateStatusAfterConfirmation(3, 3)).toBe(REQUEST_STATUSES.FULFILLED);
      expect(calculateStatusAfterConfirmation(4, 3)).toBe(REQUEST_STATUSES.FULFILLED);
    });
  });

  describe('assertValidDeadline', () => {
    it('passes when deadline is in the future', () => {
      const now = new Date('2026-10-22T12:00:00.000Z');
      const future = new Date('2026-10-22T13:00:00.000Z');
      expect(() => assertValidDeadline(future, now)).not.toThrow();
    });

    it('throws 400 when deadline is in the past or present', () => {
      const now = new Date('2026-10-22T12:00:00.000Z');
      const past = new Date('2026-10-22T11:00:00.000Z');
      expect(() => assertValidDeadline(past, now)).toThrow(AppException);
      expect(() => assertValidDeadline(now, now)).toThrow(AppException);
    });
  });
});
