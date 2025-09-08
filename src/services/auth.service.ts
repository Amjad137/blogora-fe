import Axios from '@/config/api.config';
import { ERROR_MESSAGES } from '@/constants/error.constants';
import { AuthResponseDTO, SignInRequestDTO, SignUpRequestDTO } from '@/dto/auth.dto';
import { ICommonResponseDTO } from '@/dto/common.dto';
import { toast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/auth.store';
import { IUser } from '@/types/user.type';
import ErrorHandler from '@/utils/error-handler';
import { AxiosError } from 'axios';
import { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh';
import { StatusCodes } from 'http-status-codes';

export const signUp = async (userData: SignUpRequestDTO): Promise<AuthResponseDTO> => {
  const response = await Axios.post<ICommonResponseDTO<AuthResponseDTO>>(
    '/v1/auth/sign-up',
    { ...userData },
    {
      skipAuth: true,
      skipAuthRefresh: true,
    } as AxiosAuthRefreshRequestConfig,
  );
  return response.data.data;
};

export const signIn = async (credentials: SignInRequestDTO): Promise<AuthResponseDTO> => {
  const response = await Axios.post<ICommonResponseDTO<AuthResponseDTO>>(
    '/v1/auth/sign-in',
    { ...credentials },
    {
      skipAuth: true,
      skipAuthRefresh: true,
    } as AxiosAuthRefreshRequestConfig,
  );
  return response.data.data;
};

export const signOut = async (): Promise<null> => {
  try {
    const response = await Axios.post<ICommonResponseDTO<null>>('/v1/auth/sign-out');
    toast({
      title: 'See You Soon!',
      description: 'Signed out successfully.',
    });
    return response.data.data;
  } catch (error) {
    // Show error message
    if (error instanceof AxiosError) {
      const { errorMessage } = ErrorHandler(error);
      toast({
        title: 'Error!',
        description: errorMessage,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Error!',
        description: ERROR_MESSAGES.UNKNOWN_ERR,
        variant: 'destructive',
      });
    }
    return null;
  }
};

export const refreshToken = async (): Promise<{ accessToken: string }> => {
  const response =
    await Axios.post<ICommonResponseDTO<{ accessToken: string }>>('/v1/auth/refresh-token');

  return response.data.data;
};

export const getMe = async (): Promise<IUser> => {
  const { setUser, setUserRole, setIsAuthenticated, setLoading, signOutApp } =
    useAuthStore.getState();
  try {
    const response = await Axios.get<ICommonResponseDTO<{ user: IUser }>>('/v1/auth/me');
    const { user } = response.data.data;
    setLoading(false);
    setUser(user);
    setUserRole(user.role);
    setIsAuthenticated(true);
    return user;
  } catch (error) {
    if (error instanceof AxiosError) {
      const { errorMessage } = ErrorHandler(error);
      toast({
        title: 'Error!',
        description: errorMessage,
        variant: 'destructive',
      });
      // If the error is unauthorized, handle token cleanup
      if (error.response?.status === StatusCodes.UNAUTHORIZED) {
        console.warn('Unauthorized: Clearing tokens');
        // Clear tokens
        await signOutApp();
      }
    }
    throw new Error('Failed to refresh token');
  }
};

export const refreshUser = async (): Promise<IUser> => {
  const { setUser, setUserRole, setIsAuthenticated, signOutApp } = useAuthStore.getState();
  try {
    const response = await Axios.get<ICommonResponseDTO<{ user: IUser }>>('/v1/auth/me');
    const { user } = response.data.data;
    setUser(user);
    setUserRole(user.role);
    setIsAuthenticated(true);
    return user;
  } catch (error) {
    if (error instanceof AxiosError) {
      const { errorMessage } = ErrorHandler(error);
      toast({
        title: 'Error!',
        description: errorMessage,
        variant: 'destructive',
      });
      // If the error is unauthorized, handle token cleanup
      if (error.response?.status === StatusCodes.UNAUTHORIZED) {
        console.warn('Unauthorized: Clearing tokens');
        // Clear tokens
        await signOutApp();
      }
    }
    throw new Error('Failed to refresh user');
  }
};

export const updatePassword = async ({
  userId,
  currentPassword,
  newPassword,
}: {
  userId: string;
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    const response = await Axios.patch<ICommonResponseDTO<{ message: string }>>(
      `/v1/user/${userId}/password`,
      {
        currentPassword,
        newPassword,
      },
    );
    toast({
      title: 'Success!',
      description: response.data.data.message || 'Password updated successfully.',
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const { errorMessage } = ErrorHandler(error);
      toast({
        title: 'Error!',
        description: errorMessage,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Error!',
        description: ERROR_MESSAGES.UNKNOWN_ERR,
        variant: 'destructive',
      });
    }
    throw error;
  }
};

export const forgotPassword = async (userName: string) => {
  try {
    const response = await Axios.post<ICommonResponseDTO<{ message: string; resetUrl?: string }>>(
      '/v1/auth/forgot-password',
      { userName },
      {
        skipAuth: true,
        skipAuthRefresh: true,
      } as AxiosAuthRefreshRequestConfig,
    );
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const { errorMessage } = ErrorHandler(error);
      toast({
        title: 'Error!',
        description: errorMessage,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Error!',
        description: ERROR_MESSAGES.UNKNOWN_ERR,
        variant: 'destructive',
      });
    }
    throw error;
  }
};

export const validateResetToken = async (token: string, userId: string) => {
  try {
    const response = await Axios.post<ICommonResponseDTO<{ isValid: boolean; message?: string }>>(
      '/v1/auth/validate-reset-token',
      { token, userId },
      {
        skipAuth: true,
        skipAuthRefresh: true,
      } as AxiosAuthRefreshRequestConfig,
    );
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const { errorMessage } = ErrorHandler(error);
      toast({
        title: 'Error!',
        description: errorMessage,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Error!',
        description: ERROR_MESSAGES.UNKNOWN_ERR,
        variant: 'destructive',
      });
    }
    throw error;
  }
};

export const resetPassword = async ({
  token,
  userId,
  newPassword,
}: {
  token: string;
  userId: string;
  newPassword: string;
}) => {
  const { clearSensitiveData } = useAuthStore.getState();

  try {
    const response = await Axios.post<ICommonResponseDTO<{ message: string }>>(
      '/v1/auth/reset-password',
      { token, userId, newPassword },
      {
        skipAuth: true,
        skipAuthRefresh: true,
      } as AxiosAuthRefreshRequestConfig,
    );

    // Clear any existing auth data for security
    clearSensitiveData();

    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const { errorMessage } = ErrorHandler(error);
      toast({
        title: 'Error!',
        description: errorMessage,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Error!',
        description: ERROR_MESSAGES.UNKNOWN_ERR,
        variant: 'destructive',
      });
    }
    throw error;
  }
};
