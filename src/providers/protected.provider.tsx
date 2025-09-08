'use client';

import { AccountInactive } from '@/components/auth/account-inactive';
import { Unauthorized } from '@/components/auth/unauthorized';
import PageLoader from '@/components/shared/page-loader';
import { ROUTES } from '@/constants/routes.constants';
import { USER_ROLE } from '@/constants/user.constants';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedProps {
  children: React.ReactNode;
  allowedRoles?: USER_ROLE[];
}

export const Protected = ({ children, allowedRoles }: ProtectedProps) => {
  console.log('🚀 ~ Protected ~ allowedRoles:', allowedRoles);
  const router = useRouter();
  const { user, userRole, loading, isInitialized, isAuthenticated } = useAuthStore();

  // Redirect if no user
  useEffect(() => {
    if (isInitialized && !loading && (!user || !isAuthenticated)) {
      router.push(ROUTES.SIGN_IN);
    }
  }, [user, loading, isInitialized, router, isAuthenticated]);

  if (loading || !isInitialized) {
    return <PageLoader />;
  }

  if ((!user || !isAuthenticated) && isInitialized) {
    return <Unauthorized isAuthenticated={false} />;
  }

  // Check account status (applies to all users including admins for security)
  if (user && isAuthenticated) {
    if (!user.isActive) return <AccountInactive />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Unauthorized isAuthenticated={true} />;
  }

  return <>{children}</>;
};
