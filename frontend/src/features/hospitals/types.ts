export type HospitalType = 'government' | 'private' | 'military' | 'clinic';
export type HospitalStatus = 'pending' | 'verified' | 'suspended';

export interface HospitalAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface HospitalContact {
  phone: string;
  emergencyPhone?: string;
  email: string;
  website?: string;
}

export interface HospitalBloodBank {
  hasBloodBank: boolean;
  storageUnitsCapacity?: number;
  licensedComponents?: string[];
}

export interface Hospital {
  id: string;
  name: string;
  licenseNumber: string;
  type: HospitalType;
  status: HospitalStatus;
  address: HospitalAddress;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  contact: HospitalContact;
  bloodBank: HospitalBloodBank;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHospitalInput {
  name: string;
  licenseNumber: string;
  type: HospitalType;
  address: HospitalAddress;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  contact: HospitalContact;
  bloodBank?: HospitalBloodBank;
}
