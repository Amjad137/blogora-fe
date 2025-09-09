'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';

import {
  getSignupSchema,
  ISignupFormValues,
} from '@/components/auth/sign-up/schema/sign-up.schema';
import SignUpForm from '@/components/auth/sign-up/sign-up-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ERROR_MESSAGES } from '@/constants/error.constants';
import { ROUTES } from '@/constants/routes.constants';
import { S3_FOLDERS } from '@/constants/s3.constants';
import { SignUpRequestDTO } from '@/dto/auth.dto';
import { toast } from '@/hooks/use-toast';
import { signUp } from '@/services/auth.service';
import { uploadPublicImage } from '@/services/upload.service';
import { useAuthStore } from '@/stores/auth.store';
import ErrorHandler from '@/utils/error-handler';
import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';
import { useShallow } from 'zustand/react/shallow';

const Signup = () => {
  const { setToken, setIsAuthenticated, setUser, setUserRole } = useAuthStore(
    useShallow((s) => ({
      setIsAuthenticated: s.setIsAuthenticated,
      setToken: s.setToken,
      setUser: s.setUser,
      setUserRole: s.setUserRole,
    })),
  );

  const form = useForm<ISignupFormValues>({
    resolver: yupResolver(getSignupSchema('create')),
    defaultValues: {
      firstName: '',
      lastName: '',
      address: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const signUpFormOnSubmit = async (values: ISignupFormValues) => {
    let uploadedImageKey: string | undefined; // Track uploaded image for cleanup

    try {
      let avatar: string | undefined;

      // Upload profile picture first if provided
      if (values.profilePicture && values.profilePicture instanceof File) {
        try {
          const uploadResult = await uploadPublicImage(
            values.profilePicture,
            S3_FOLDERS.PROFILE_IMAGES,
          );
          avatar = uploadResult.url; // Use public URL instead of key
          uploadedImageKey = uploadResult.key; // Store key for potential cleanup
        } catch (uploadError) {
          console.error('Profile picture upload failed:', uploadError);
          toast({
            title: 'Profile Picture Upload Failed',
            description: 'Failed to upload profile picture. Continuing with signup...',
            variant: 'destructive',
          });
          // Continue with signup even if profile picture upload fails
        }
      }

      // Prepare signup data with public URL
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { profilePicture, ...cleanValues } = values;
      const signupData: SignUpRequestDTO = {
        ...(cleanValues as SignUpRequestDTO),
        avatar: avatar,
      };

      const response = await signUp(signupData);

      // Set auth state
      setToken(response.accessToken);
      setIsAuthenticated(true);
      setUser(response.user);
      setUserRole(response.user.role);

      // Show success message
      toast({
        title: 'Account Created',
        description: 'Account created successfully!',
      });
    } catch (error) {
      // Clean up uploaded image if signup failed
      if (uploadedImageKey) {
        try {
          const { deleteS3Files } = await import('@/services/upload.service');
          await deleteS3Files([uploadedImageKey]);
        } catch (cleanupError) {
          console.error('Failed to cleanup uploaded image:', cleanupError);
          // Don't show user error for cleanup failure
        }
      }

      // Show error message
      if (error instanceof AxiosError) {
        const { errorMessage } = ErrorHandler(error);
        toast({
          title: 'Error!',
          description: errorMessage,
          variant: 'destructive',
        });
      } else if (error instanceof Error) {
        toast({
          title: 'Error!',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error!',
          description: ERROR_MESSAGES.UNKNOWN_ERR,
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <Card className='w-full max-w-3xl mx-auto shadow-lg'>
      <CardHeader className='bg-primary/5 border-b border-border/40'>
        <CardTitle className='text-center text-primary text-2xl font-bold'>
          Create Your Account
        </CardTitle>
      </CardHeader>

      <CardContent className='p-6'>
        <SignUpForm form={form} onSubmit={signUpFormOnSubmit} isSubmitting={isSubmitting} />

        <div className='mt-6 text-center'>
          <p className='text-sm'>
            Already have an account?{' '}
            <Link className='text-primary font-medium hover:underline' href={ROUTES.SIGN_IN}>
              Sign In
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Signup;
