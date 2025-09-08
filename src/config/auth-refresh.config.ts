import Axios from '@/config/api.config';
import { ERROR_MESSAGES } from '@/constants/error.constants';
import { toast } from '@/hooks/use-toast';
import { refreshToken } from '@/services/auth.service';
import { isAxiosError } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { StatusCodes } from 'http-status-codes';

interface AuthRefreshConfig {
  setToken: (token: string | null) => void;
  onRefreshError: () => Promise<void>;
}

interface FailedRequest {
  response: {
    config: {
      headers: Record<string, string>;
    };
  };
}

export const setupAuthRefreshInterceptor = ({ setToken, onRefreshError }: AuthRefreshConfig) => {
  const interceptorId = createAuthRefreshInterceptor(
    Axios,
    async (failedRequest: FailedRequest) => {
      try {
        const { accessToken } = await refreshToken();
        setToken(accessToken);
        failedRequest.response.config.headers.Authorization = `Bearer ${accessToken}`;

        return Promise.resolve();
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === StatusCodes.UNAUTHORIZED) {
          // Check if this is a refresh token failure (specific error message)
          const errorMessage = error.response?.data?.data?.message || '';
          const isRefreshTokenError =
            errorMessage === ERROR_MESSAGES.REFRESH_TOKEN_NOT_FOUND ||
            errorMessage === ERROR_MESSAGES.REFRESH_TOKEN_INVALID_OR_EXPIRED;

          if (isRefreshTokenError) {
            // This is a refresh token failure - user needs to re-authenticate
            await onRefreshError();
            toast({
              title: 'Session Expired',
              description: 'Please login again',
              variant: 'destructive',
            });
          } else {
            // This is a regular 401 - might be a temporary issue, let it pass through
            return Promise.reject(error);
          }
        }

        return Promise.reject(error instanceof Error ? error : new Error(String(error)));
      }
    },
    {
      statusCodes: [StatusCodes.UNAUTHORIZED], // Only refresh on 401 Unauthorized
      pauseInstanceWhileRefreshing: true, // Pause other requests while refreshing
      retryInstance: Axios, // Use the same instance for retries
    },
  );

  return () => {
    Axios.interceptors.response.eject(interceptorId);
  };
};
