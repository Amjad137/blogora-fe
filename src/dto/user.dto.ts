import { USER_ROLE } from '@/constants/user.constants';
import { IPaginationQuery } from './common.dto';

export interface IUserQuery extends IPaginationQuery {
  role?: USER_ROLE;
  isActive?: boolean;
}
