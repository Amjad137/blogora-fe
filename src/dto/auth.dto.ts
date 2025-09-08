// Role-specific interfaces

import { IAddress, IUser } from '@/types/user.type';

export interface SignUpRequestDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: IAddress;
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
