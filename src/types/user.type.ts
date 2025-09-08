import { USER_ROLE } from '@/constants/user.constants';
import { IBaseEntity } from './common.type';

export interface IUser extends IBaseEntity {
  firstName: string;
  lastName: string;
  role: USER_ROLE;
  phoneNo: string;
  email: string;
  address: IAddress;
  profilePicUrl?: string;
}

export interface IAddress {
  line1: string; //16, Hapugedara lane
  line2?: string; //Malwathe Road
  city: string; //Colombo
}
