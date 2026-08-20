import { UserJobProfile } from './model.user';

export interface Authority {
  authority: string; // Role
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface IUserSessionInfo {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  birthDate?: Date;
  profileUrl?: string;
  address?: string;
  phoneNumber?: string;
  gender?: string;
  accountVerified: boolean;
  country?: string; // ISO 3166-1 alpha-3 format
  identificationNumber?: string;
  identificationType?: string;
  role: UserRole;

  // Relationships
  userJobProfile?: UserJobProfile[];

  // UserDetails methods
  authorities?: Authority[];
  isAccountNonExpired: boolean;
  isAccountNonLocked: boolean;
  isCredentialsNonExpired: boolean;
  isEnabled: boolean;
}

// Session petition & response
export interface ILoginRequest {
  username: string;
  password: string;
}
