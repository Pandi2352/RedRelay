import { HttpStatus } from '@nestjs/common';
import { AppException } from '../../common';
import {
  REQUEST_ERROR_CODES,
  REQUEST_STATUSES,
  type RequestStatus,
} from './requests.constants';

/** Legal state transitions according to the RedRelay dispatch state machine. */
export const ALLOWED_TRANSITIONS: Readonly<Record<RequestStatus, readonly RequestStatus[]>> = {
  [REQUEST_STATUSES.OPEN]: [
    REQUEST_STATUSES.PARTIALLY_MATCHED,
    REQUEST_STATUSES.FULFILLED,
    REQUEST_STATUSES.EXPIRED,
    REQUEST_STATUSES.CANCELLED,
  ],
  [REQUEST_STATUSES.PARTIALLY_MATCHED]: [
    REQUEST_STATUSES.FULFILLED,
    REQUEST_STATUSES.EXPIRED,
    REQUEST_STATUSES.CANCELLED,
  ],
  [REQUEST_STATUSES.FULFILLED]: [],
  [REQUEST_STATUSES.EXPIRED]: [],
  [REQUEST_STATUSES.CANCELLED]: [],
};

export const TERMINAL_STATUSES: ReadonlySet<RequestStatus> = new Set([
  REQUEST_STATUSES.FULFILLED,
  REQUEST_STATUSES.EXPIRED,
  REQUEST_STATUSES.CANCELLED,
]);

/** Pure check whether a status transition is allowed. */
export function canTransition(from: RequestStatus, to: RequestStatus): boolean {
  if (from === to) return true;
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

/** Asserts that a status transition is allowed; throws 409 Conflict if not. */
export function assertTransition(from: RequestStatus, to: RequestStatus): void {
  if (!canTransition(from, to)) {
    throw new AppException(
      HttpStatus.CONFLICT,
      REQUEST_ERROR_CODES.INVALID_TRANSITION,
      `Cannot transition request from "${from}" to "${to}".`,
    );
  }
}

/** Returns true if the status is a terminal state that halts dispatch waves. */
export function isTerminalStatus(status: RequestStatus): boolean {
  return TERMINAL_STATUSES.has(status);
}

/** Pure function calculating new request status based on confirmed units. */
export function calculateStatusAfterConfirmation(
  unitsConfirmed: number,
  unitsNeeded: number,
): RequestStatus {
  if (unitsConfirmed >= unitsNeeded) {
    return REQUEST_STATUSES.FULFILLED;
  }
  if (unitsConfirmed > 0) {
    return REQUEST_STATUSES.PARTIALLY_MATCHED;
  }
  return REQUEST_STATUSES.OPEN;
}

/** Asserts that the requested deadline is in the future. */
export function assertValidDeadline(deadlineAt: Date, now: Date = new Date()): void {
  if (deadlineAt.getTime() <= now.getTime()) {
    throw new AppException(
      HttpStatus.BAD_REQUEST,
      REQUEST_ERROR_CODES.INVALID_DEADLINE,
      'Request deadline must be in the future.',
    );
  }
}
