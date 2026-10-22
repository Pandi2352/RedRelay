export enum Role {
  Donor = 'donor',
  HospitalUser = 'hospital_user',
  PlatformAdmin = 'platform_admin',
}

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  name: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  name: string;
  iat?: number;
  exp?: number;
}
