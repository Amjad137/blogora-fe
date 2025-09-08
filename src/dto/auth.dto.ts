// Role-specific interfaces

import { IAddress, IUser } from '@/types/user.type';

export interface SignUpRequestDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNo: string;
  address: IAddress;
  profilePicUrl?: string;
}

export interface AuthResponseDTO {
  user: Omit<IUser, 'password'>;
  accessToken: string;
}

export interface SignInRequestDTO {
  email: string;
  password: string;
}
