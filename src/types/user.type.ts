import { USER_ROLE } from '@/constants/user.constants';
import { IBaseEntity } from './common.type';

export interface IUser extends IBaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: USER_ROLE;
  avatar?: string;
  address: string;
  isActive: boolean;
  isEmailVerified: boolean;
}
