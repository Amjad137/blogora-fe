// Role-specific interfaces

import { IUser } from '@/types/user.type';

export interface SignUpRequestDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  avatar?: string;
}

export interface AuthResponseDTO {
  user: IUser;
  accessToken: string;
}

export interface SignInRequestDTO {
  email: string;
  password: string;
}
