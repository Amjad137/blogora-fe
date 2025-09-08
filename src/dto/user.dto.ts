import { USER_ROLE } from '@/constants/user.constants';
import { IBaseEntity } from '@/types/common.type';
import { IAddress } from '@/types/user.type';
import { IPaginationQuery } from './common.dto';

export interface IUser extends IBaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: USER_ROLE;
  avatar?: string;
  address: IAddress;
  isActive: boolean;
  isEmailVerified: boolean;
}

export interface IUserQuery extends IPaginationQuery {
  role?: USER_ROLE;
  isActive?: boolean;
}
