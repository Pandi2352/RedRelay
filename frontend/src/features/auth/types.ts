export type Role = 'platform_admin' | 'hospital_admin' | 'hospital_staff' | 'donor';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: 'active' | 'suspended';
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  role: Role;
  phone?: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}
