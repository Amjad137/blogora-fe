'use client';

import { useForm } from 'react-hook-form';

import { ROUTES } from '@/constants/routes.constants';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ERROR_MESSAGES } from '@/constants/error.constants';
import { toast } from '@/hooks/use-toast';
import { signIn } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import ErrorHandler from '@/utils/error-handler';
import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { InferType, object, string } from 'yup';
import { useShallow } from 'zustand/react/shallow';

const loginSchema = object({
  email: string().email('Invalid email format.').required('Email is required.'),
  password: string()
    .min(6, 'Password must be at least 6 characters.')
    .required('Password is required.'),
});

type FormValues = InferType<typeof loginSchema>;

export default function SignInPage() {
  const { setToken, setIsAuthenticated, setUser, setUserRole, setLoading, loading } = useAuthStore(
    useShallow((s) => ({
      setIsAuthenticated: s.setIsAuthenticated,
      setToken: s.setToken,
      setUser: s.setUser,
      setUserRole: s.setUserRole,
      setLoading: s.setLoading,
      loading: s.loading,
      token: s.token,
      user: s.user,
    })),
  );

  const form = useForm<FormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signInFormOnSubmit = form.handleSubmit(async (values: FormValues) => {
    try {
      setLoading(true);
      const response = await signIn(values);

      // Set auth state
      setToken(response.accessToken);
      setIsAuthenticated(true);
      setUser(response.user);
      setUserRole(response.user.role);

      // Show success message
      toast({
        title: 'Welcome Back!',
        description: 'You have successfully signed in to your account.',
      });
    } catch (error) {
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
    } finally {
      setLoading(false);
    }
  });

  return (
    <Card className='min-w-[350px]'>
      <CardHeader className='p-3'>
        <CardTitle className='text-center text-xl font-bold'>Sign In</CardTitle>
      </CardHeader>

      <CardContent className='flex flex-col gap-5'>
        <Form {...form}>
          <form onSubmit={signInFormOnSubmit} className='flex flex-col gap-3 min-w-30'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder='Username' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder='Password' type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Link
              href={ROUTES.FORGOT_PASSWORD}
              className='text-sm text-right font-medium text-muted-foreground hover:underline underline-offset-2'
            >
              Forgot Password?
            </Link>
            <Button type='submit' loading={loading} disabled={loading}>
              Sign In
            </Button>
          </form>

          <h5 className='text-xs text-center'>
            Don&apos;t have an account?{' '}
            <Link className='underline' href={ROUTES.SIGN_UP}>
              Sign Up
            </Link>
          </h5>
        </Form>
      </CardContent>
    </Card>
  );
}
