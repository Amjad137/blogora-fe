'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGetCommentsByPostInfinite, useCreateComment } from '@/hooks/use-comment';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/stores/auth.store';
import { getUserInitials } from '@/utils/user-utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { InferType, object, string } from 'yup';
import { CommentItem } from './comment-item';

interface CommentAreaProps {
  readonly postId: string;
  readonly isVisible: boolean;
  readonly className?: string;
}

const commentSchema = object({
  content: string()
    .required('Comment is required')
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment cannot exceed 1000 characters')
    .trim(),
});
type ICommentFormValues = InferType<typeof commentSchema>;

export function CommentArea({ postId, isVisible, className }: Readonly<CommentAreaProps>) {
  const { user } = useAuthStore();
  const [replyTarget, setReplyTarget] = useState<string | null>(null);

  // Fetch comments with infinite loading
  const { comments, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetCommentsByPostInfinite(postId, {
      enabled: isVisible,
      limit: 10, // Load 10 comments at a time
    });

  // Create comment mutation
  const { mutate: createComment, isPending: isCreatingComment } = useCreateComment();

  // Form setup
  const form = useForm<ICommentFormValues>({
    resolver: yupResolver(commentSchema),
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = (data: ICommentFormValues) => {
    createComment({
      commentData: {
        content: data.content.trim(),
        post: postId,
        parent: replyTarget || undefined,
      },
    });
    form.reset();
    setReplyTarget(null);
  };

  const handleReply = (commentId: string) => {
    // Only allow replying to root comments
    const targetComment = comments.find((comment) => comment._id === commentId);
    if (targetComment) {
      setReplyTarget(commentId);
      form.setFocus('content');
    }
  };

  if (!isVisible) return null;

  return (
    <div className={cn('border-t pt-4 p-2 space-y-4', className)}>
      {/* Comments List */}
      <div className='max-h-80 overflow-y-auto space-y-3'>
        {isLoading ? (
          <div className='space-y-3'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='flex gap-3'>
                <Skeleton className='h-8 w-8 rounded-full' />
                <div className='flex-1 space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Skeleton className='h-4 w-24' />
                    <Skeleton className='h-3 w-16' />
                  </div>
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-3/4' />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='space-y-4'>
            {comments.map((comment) => (
              <CommentItem key={comment._id} comment={comment} onReply={handleReply} />
            ))}

            {comments.length === 0 && (
              <div className='text-center py-6 text-muted-foreground'>
                <p className='text-sm'>No comments yet. Be the first to comment!</p>
              </div>
            )}

            {/* Load More Button */}
            {hasNextPage && (
              <div className='flex justify-center pt-4'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  loading={isFetchingNextPage}
                  className='text-sm'
                >
                  {isFetchingNextPage ? 'Loading...' : 'Load More Comments'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Comment Input */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex gap-3 pt-2 border-t'>
          <Avatar className='h-8 w-8 flex-shrink-0'>
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className='text-xs'>{getUserInitials(user)}</AvatarFallback>
          </Avatar>
          <div className='flex-1 space-y-2'>
            {replyTarget && (
              <div className='text-xs text-muted-foreground bg-gray-50 px-2 py-1 rounded'>
                Replying to comment...
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={() => setReplyTarget(null)}
                  className='ml-2 text-xs h-auto p-0'
                >
                  Cancel
                </Button>
              </div>
            )}
            <div className='flex gap-2'>
              <FormField
                control={form.control}
                name='content'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormControl>
                      <Input
                        placeholder={replyTarget ? 'Write a reply...' : 'Write a comment...'}
                        className='h-8 text-sm'
                        disabled={isCreatingComment}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type='submit'
                size='sm'
                disabled={isCreatingComment || !form.formState.isDirty}
                loading={isCreatingComment}
                className='h-8 px-3'
              >
                <Send className='h-3 w-3' />
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
