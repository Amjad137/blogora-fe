import { IUser } from '@/types/user.type';

type UserLike = IUser | { userId?: IUser } | null | undefined;

/**
 * Gets user initials from first and last name
 */
export const getUserInitials = (user: UserLike): string => {
  if (!user) return 'NA';

  const userData = 'userId' in user ? user.userId : (user as IUser);
  if (!userData) return 'NA';

  const firstName = userData.firstName || '';
  const lastName = userData.lastName || '';

  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
};

/**
 * Gets formatted full name of a user
 */
export const getUserFullName = (user: UserLike): string => {
  if (!user) return 'Unknown';

  const userData = 'userId' in user ? user.userId : (user as IUser);
  if (!userData) return 'Unknown';

  const { firstName, lastName } = userData;
  return `${firstName || ''} ${lastName || ''} `.trim() || 'Unknown';
};
