'use client';

import PageLoader from '@/components/shared/page-loader';
import { ROUTES } from '@/constants/routes.constants';
import { useAuthStore } from '@/stores/auth.store';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface PublicProps {
  children: React.ReactNode;
}

export const Public = ({ children }: PublicProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, isInitialized, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isInitialized && !loading && user && isAuthenticated && pathname.startsWith('/auth')) {
      router.push(ROUTES.ROOT);
    }
  }, [user, loading, isInitialized, router, isAuthenticated, pathname]);

  if (loading || !isInitialized) {
    return <PageLoader />;
  }

  return <>{children}</>;
};
