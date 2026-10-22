export const BLOOD_GROUPS = [
  'O-',
  'O+',
  'A-',
  'A+',
  'B-',
  'B+',
  'AB-',
  'AB+',
] as const;

export type BloodGroup = (typeof BLOOD_GROUPS)[number];

export const REQUEST_URGENCIES = {
  NORMAL: 'normal',
  URGENT: 'urgent',
  CRITICAL: 'critical',
} as const;

export type RequestUrgency = (typeof REQUEST_URGENCIES)[keyof typeof REQUEST_URGENCIES];

export const REQUEST_STATUSES = {
  OPEN: 'open',
  PARTIALLY_MATCHED: 'partially_matched',
  FULFILLED: 'fulfilled',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
} as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[keyof typeof REQUEST_STATUSES];

export const REQUEST_ERROR_CODES = {
  REQUEST_NOT_FOUND: 'REQUEST_NOT_FOUND',
  INVALID_TRANSITION: 'INVALID_TRANSITION',
  REQUEST_FULL: 'REQUEST_FULL',
  HOSPITAL_NOT_VERIFIED: 'HOSPITAL_NOT_VERIFIED',
  INVALID_DEADLINE: 'INVALID_DEADLINE',
} as const;

export const UNITS_LIMITS = {
  MIN: 1,
  MAX: 10,
} as const;
