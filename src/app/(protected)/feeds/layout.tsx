import { USER_ROLE } from '@/constants/user.constants';
import { Protected } from '@/providers/protected.provider';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const FeedLayout = ({ children }: Props) => {
  return (
    <Protected allowedRoles={[USER_ROLE.ADMIN, USER_ROLE.USER]}>
      <div className='min-h-screen flex flex-col'>
        <main className='flex-1 p-2 md:p-4'>{children}</main>
      </div>
    </Protected>
  );
};
export default FeedLayout;
