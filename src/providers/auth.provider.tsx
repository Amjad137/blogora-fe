'use client';

import PageLoader from '@/components/shared/page-loader';
import { setupAuthRefreshInterceptor } from '@/config/auth-refresh.config';
import { getMe } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { useEffect } from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const {
    user,
    setUser,
    setUserRole,
    token,
    setToken,
    signOutApp,
    loading,
    setLoading,
    setIsAuthenticated,
    isInitialized,
    setIsInitialized,
  } = useAuthStore();

  // Setup auth refresh interceptor
  useEffect(() => {
    return setupAuthRefreshInterceptor({
      setToken,
      onRefreshError: signOutApp,
    });
  }, [setToken, signOutApp]);

  // Handle all token/user combinations
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Case 1: Both token and user exist - already authenticated
        if (token && user) {
          setIsAuthenticated(true);
          setIsInitialized(true);
          return;
        }

        // Case 2: Token exists but no user - fetch user data
        if (token && !user) {
          setLoading(true);
          try {
            const userData = await getMe();
            setUser(userData);
            setUserRole(userData.role);
            setIsAuthenticated(true);
          } catch (error) {
            console.warn('Failed to fetch user data:', error);
            // Token invalid or expired, clean up
            await signOutApp();
          } finally {
            setLoading(false);
          }
          return;
        }

        // Case 3: User exists but no token - invalid state, sign out
        if (!token && user) {
          console.warn('User exists without token - signing out');
          await signOutApp();
          return;
        }

        // Case 4: Neither token nor user - not authenticated
        if (!token && !user) {
          setIsAuthenticated(false);
        }
      } finally {
        // Always mark as initialized when done
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [
    token,
    user,
    setUser,
    setUserRole,
    setIsAuthenticated,
    setLoading,
    signOutApp,
    setIsInitialized,
  ]);

  // Show loader while initializing
  if (!isInitialized || loading) {
    return <PageLoader />;
  }

  return <>{children}</>;
};
