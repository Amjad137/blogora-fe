'use client';

import { SiteHeader } from '@/components/shared/header';
import { UserHeader } from '@/components/shared/user-header';
import { AdminSidebar } from '@/components/sidebar/admin/admin-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { USER_ROLE } from '@/constants/user.constants';
import { Protected } from '@/providers/protected.provider';
import ReactQueryProvider from '@/providers/react-query.provider';
import { useAuthStore } from '@/stores/auth.store';
import { ReactNode } from 'react';
import { useShallow } from 'zustand/react/shallow';

type Props = {
  children: ReactNode;
};

const AppLayout = ({ children }: Props) => {
  const { userRole } = useAuthStore(
    useShallow((state) => ({
      userRole: state.userRole,
    })),
  );
  const renderSidebar = (userRole: USER_ROLE) => {
    if (userRole === USER_ROLE.ADMIN) {
      return <AdminSidebar />;
    }
  };
  return (
    <Protected allowedRoles={[USER_ROLE.ADMIN, USER_ROLE.USER]}>
      <ReactQueryProvider>
        <SidebarProvider>
          {userRole && renderSidebar(userRole)}
          <SidebarInset>
            {userRole === USER_ROLE.ADMIN ? <SiteHeader /> : <UserHeader />}
            <div className='container mx-auto flex flex-1 flex-col w-full gap-2'>{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </ReactQueryProvider>
    </Protected>
  );
};

export default AppLayout;
