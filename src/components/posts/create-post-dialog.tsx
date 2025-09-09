'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from '@/hooks/use-toast';
import { object, string, array, InferType } from 'yup';
import { POST_STATUS } from '@/constants/post.constants';
import { MultiValueField } from '@/components/ui/multi-value-input';
import FileUploadInput from '../ui/file-upload-input';
import { fileValidation, extractS3KeyFromUrl } from '@/utils/s3-utils';
import { getUserInitials } from '@/utils/user-utils';
import { uploadPublicImage, deleteS3Files } from '@/services/upload.service';
import { S3_FOLDERS } from '@/constants/s3.constants';
import { CreatePostRequestDTO, PostResponseDTO, UpdatePostRequestDTO } from '@/dto/post.dto';
import { useCreatePost, useUpdatePost } from '@/hooks/use-post';
import { AxiosError } from 'axios';
import ErrorHandler from '@/utils/error-handler';
import { ERROR_MESSAGES } from '@/constants/error.constants';

// Validation schema
const createPostSchema = object({
  content: string().required('Content is required'),
  featuredImage: fileValidation(true),
  tags: array().of(string()).default([]),
});

type CreatePostFormValues = InferType<typeof createPostSchema>;

type Props = {
  children: React.ReactNode;
  editPost?: PostResponseDTO;
  onEditComplete?: () => void;
};

const CreatePostDialog = ({ children, editPost, onEditComplete }: Props) => {
  const [open, setOpen] = useState(false);
  const [existingImageDeleted, setExistingImageDeleted] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const { user } = useAuthStore();
  const { mutateAsync: createPost, isPending: isCreating } = useCreatePost();
  const { mutateAsync: updatePost, isPending: isUpdating } = useUpdatePost();

  const isEditMode = !!editPost;
  const hasExistingImage = editPost?.featuredImage && !existingImageDeleted;

  const form = useForm<CreatePostFormValues>({
    resolver: yupResolver(createPostSchema),
    defaultValues: {
      content: '',
      tags: [],
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (editPost) {
      form.reset({
        content: editPost.content,
        tags: editPost.tags || [],
      });
    }
    // Reset image deletion state when dialog opens
    setExistingImageDeleted(false);
  }, [editPost, form, open]);

  const isSubmitting = form.formState.isSubmitting || isCreating || isUpdating;

  // Handle existing image deletion
  const handleDeleteExistingImage = async () => {
    if (!editPost?.featuredImage) return;

    setIsDeletingImage(true);
    try {
      const s3Key = extractS3KeyFromUrl(editPost.featuredImage);
      if (s3Key) {
        await deleteS3Files([s3Key]);
      }
      setExistingImageDeleted(true);
      toast({
        title: 'Success',
        description: 'Image deleted successfully',
      });
    } catch (error) {
      console.error('Failed to delete image:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeletingImage(false);
    }
  };

  // Handle form submission with specific status
  const onSubmit = async (values: CreatePostFormValues, status: POST_STATUS) => {
    let uploadedImageKey: string | undefined; // Track uploaded image for cleanup

    try {
      let featuredImageUrl: string | undefined;

      // Upload featured image first if provided

      if (
        values.featuredImage &&
        Array.isArray(values.featuredImage) &&
        values.featuredImage.length > 0 &&
        values.featuredImage[0] instanceof File
      ) {
        try {
          const uploadResult = await uploadPublicImage(
            values.featuredImage[0],
            S3_FOLDERS.FEED_IMAGES,
          );
          featuredImageUrl = uploadResult.url; // Use public URL instead of key
          uploadedImageKey = uploadResult.key; // Store key for potential cleanup
        } catch (uploadError) {
          console.error('Featured image upload failed:', uploadError);
          toast({
            title: 'Image Upload Failed',
            description: 'Failed to upload featured image. Continuing without image...',
            variant: 'destructive',
          });
          // Continue with post creation even if image upload fails
        }
      }

      if (isEditMode && editPost) {
        // Update existing post
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { featuredImage, ...cleanValues } = values;

        // Determine the final featured image value based on scenarios:
        // 1. If user deleted existing image and didn't upload new one -> undefined
        // 2. If user deleted existing image and uploaded new one -> new image URL
        // 3. If user didn't delete existing image and uploaded new one -> new image URL
        // 4. If user didn't delete existing image and didn't upload new one -> keep existing image
        let finalFeaturedImage: string | null | undefined;

        if (existingImageDeleted) {
          // Scenario 1 & 2: User deleted existing image
          finalFeaturedImage = featuredImageUrl || null; // null if no new image uploaded
        } else {
          // Scenario 3 & 4: User didn't delete existing image
          finalFeaturedImage = featuredImageUrl || editPost.featuredImage; // new image or keep existing
        }

        const updateData: UpdatePostRequestDTO = {
          ...(cleanValues as UpdatePostRequestDTO),
          featuredImage: finalFeaturedImage,
          status,
        };

        await updatePost({ postId: editPost._id, updates: updateData });

        // Call completion callback
        onEditComplete?.();
      } else {
        // Create new post

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { featuredImage, ...cleanValues } = values;
        const postData: CreatePostRequestDTO = {
          ...(cleanValues as CreatePostRequestDTO),
          featuredImage: featuredImageUrl,
          status,
        };

        await createPost({ postData });
      }

      // Show success message
      toast({
        title: isEditMode ? 'Post Updated' : 'Post Created',
        description: `Your post has been ${isEditMode ? 'updated' : 'created'} successfully!`,
      });

      // Reset form and close dialog
      form.reset();
      setOpen(false);
    } catch (error) {
      // Clean up uploaded image if post creation failed
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>
            {isEditMode ? 'Edit Post' : 'Create New Post'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className='space-y-6'>
            {/* Author Info */}
            <div className='flex items-center gap-3 p-3 bg-muted/50 rounded-lg'>
              <Avatar className='h-10 w-10'>
                <AvatarImage src={user?.avatar} alt='Author avatar' />
                <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
              </Avatar>
              <div>
                <p className='font-medium text-sm'>
                  {user?.firstName} {user?.lastName}
                </p>
                <p className='text-xs text-muted-foreground'>Author</p>
              </div>
            </div>

            {/* Post Content */}
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Write your post content here...'
                      className='min-h-[200px]'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The main content of your post. You can use markdown formatting.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Featured Image */}
            <FormField
              control={form.control}
              name='featuredImage'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Featured Image</FormLabel>
                  <FormControl>
                    {isEditMode && hasExistingImage ? (
                      <div className='relative group'>
                        <div className='aspect-video w-full overflow-hidden rounded-lg bg-muted relative'>
                          <Image
                            src={editPost.featuredImage || ''}
                            alt='Featured image'
                            fill
                            className='object-cover'
                          />
                          {isDeletingImage && (
                            <div className='absolute inset-0 bg-black/50 flex items-center justify-center'>
                              <div className='flex flex-col items-center gap-2 text-white'>
                                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white'></div>
                                <span className='text-sm'>Deleting image...</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <Button
                          type='button'
                          variant='destructive'
                          size='sm'
                          onClick={handleDeleteExistingImage}
                          disabled={isDeletingImage}
                          className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      </div>
                    ) : (
                      <div className='space-y-2'>
                        <FileUploadInput
                          value={field.value}
                          onChange={field.onChange}
                          multiple={false}
                          supportedFormats={['image/jpg', 'image/jpeg', 'image/png']}
                          additionalInstructions={[
                            'Clear and sharp images only',
                            'Max 5MB file size',
                          ]}
                        />
                        {isEditMode && existingImageDeleted && (
                          <p className='text-sm text-muted-foreground'>
                            Previous image has been deleted. Upload a new image or leave empty.
                          </p>
                        )}
                      </div>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags */}
            <FormField
              control={form.control}
              name='tags'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <MultiValueField
                      control={form.control}
                      name={field.name}
                      placeholder='Type qualifications and press Enter...'
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Add tags to help categorize your post. Press Enter or click + to add.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <div className='flex justify-end gap-3 pt-4 border-t'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={async () => {
                  const isValid = await form.trigger();
                  if (isValid) {
                    const values = form.getValues();
                    await onSubmit(values, POST_STATUS.DRAFT);
                  }
                }}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Save as Draft
              </Button>
              <Button
                type='button'
                onClick={async () => {
                  const isValid = await form.trigger();
                  if (isValid) {
                    const values = form.getValues();
                    await onSubmit(values, POST_STATUS.PUBLISHED);
                  }
                }}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Post
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
