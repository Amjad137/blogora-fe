import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';

import ProfilePictureUpload from '@/components/auth/sign-up/profile-picture-upload';
import { PhoneInput } from '@/components/ui/phone-input';
import { ISignupFormValues } from './schema/sign-up.schema';

type Props = {
  form: UseFormReturn<ISignupFormValues>;
  onSubmit: (data: ISignupFormValues) => void;
  isSubmitting: boolean;
  isEditing?: boolean;
  initialData?: ISignupFormValues;
};

const SignUpForm = ({ form, onSubmit, isSubmitting, isEditing }: Props) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        {/* Personal Information Section */}
        <div className='space-y-4'>
          <h3 className='text-lg font-medium'>Personal Information</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder='ex: Dale' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='lastName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder='ex: Philip' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='phoneNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Phone Number</FormLabel>
                  <FormControl>
                    <PhoneInput
                      disabled={isSubmitting}
                      defaultCountry='LK'
                      placeholder='Enter a Contact Number'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Profile Picture Section */}
        <div className='space-y-4'>
          <h3 className='text-lg font-medium'>Profile Picture</h3>
          <ProfilePictureUpload form={form} isSubmitting={isSubmitting} isEditing={isEditing} />
        </div>

        {/* Address Section */}
        <div className='space-y-4'>
          <h3 className='text-lg font-medium'>Address Information</h3>
          <div className='grid grid-cols-1 gap-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='address.line1'
                render={({ field }) => (
                  <FormItem className='col-span-full'>
                    <FormLabel required>Address Line 1</FormLabel>
                    <FormControl>
                      <Input placeholder='16, Hapugedara Lane' {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='address.line2'
                render={({ field }) => (
                  <FormItem className='col-span-full'>
                    <FormLabel>Address Line 2</FormLabel>
                    <FormControl>
                      <Input placeholder='Panama' {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='address.city'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>City</FormLabel>
                    <FormControl>
                      <Input placeholder='Colombo' {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        {/* Role based details */}

        {/* Security Section */}
        {!isEditing && (
          <div className='space-y-4'>
            <h3 className='text-lg font-medium'>Account Security</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Password</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='Password@123' {...field} />
                    </FormControl>
                    <FormDescription>
                      Must include uppercase, lowercase, number and special character
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='Password@123' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
        <div className='pt-4'>
          <Button
            type='submit'
            className='w-full'
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            {isEditing ? 'Update Profile' : 'Create Account'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SignUpForm;
