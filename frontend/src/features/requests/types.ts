export type BloodType =
  | 'A_POS'
  | 'A_NEG'
  | 'B_POS'
  | 'B_NEG'
  | 'AB_POS'
  | 'AB_NEG'
  | 'O_POS'
  | 'O_NEG';

export type RequestUrgency = 'critical' | 'urgent' | 'standard';

export type RequestStatus =
  | 'open'
  | 'partially_matched'
  | 'fully_matched'
  | 'fulfilled'
  | 'cancelled'
  | 'expired';

export interface BloodRequest {
  id: string;
  hospitalId: string;
  bloodType: BloodType;
  urgency: RequestUrgency;
  status: RequestStatus;
  unitsNeeded: number;
  unitsConfirmed: number;
  unitsFulfilled: number;
  patientName?: string;
  medicalNotes?: string;
  neededBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequestInput {
  hospitalId: string;
  bloodType: BloodType;
  urgency: RequestUrgency;
  unitsNeeded: number;
  patientName?: string;
  medicalNotes?: string;
  neededBy?: string;
}

export interface QueryRequestsInput {
  hospitalId?: string;
  status?: RequestStatus;
  bloodType?: BloodType;
  urgency?: RequestUrgency;
  page?: number;
  limit?: number;
}
