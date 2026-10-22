export const HOSPITAL_TYPES = {
  HOSPITAL: 'hospital',
  BLOOD_BANK: 'blood_bank',
} as const;

export type HospitalType = (typeof HOSPITAL_TYPES)[keyof typeof HOSPITAL_TYPES];

export const VERIFICATION_STATUSES = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
} as const;

export type VerificationStatus = (typeof VERIFICATION_STATUSES)[keyof typeof VERIFICATION_STATUSES];

export const HOSPITAL_ERROR_CODES = {
  HOSPITAL_NOT_FOUND: 'HOSPITAL_NOT_FOUND',
} as const;
