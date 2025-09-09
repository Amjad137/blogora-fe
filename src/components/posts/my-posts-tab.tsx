'use client';

import { PostCard } from '@/components/posts/post-card';
import { Skeleton } from '@/components/ui/skeleton';
import { PostResponseDTO } from '@/dto/post.dto';

interface MyPostsTabProps {
  posts: PostResponseDTO[];
  isLoading: boolean;
}

export const MyPostsTab = ({ posts, isLoading }: MyPostsTabProps) => {
  if (isLoading) {
    return (
      <div className='space-y-6'>
        {[1, 2, 3].map((i) => (
          <div key={i} className='rounded-lg p-4 space-y-4 border'>
            <div className='flex items-center gap-3'>
              <Skeleton className='h-10 w-10 rounded-full' />
              <div className='space-y-2'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-3 w-20' />
              </div>
            </div>
            <Skeleton className='h-48 w-full rounded-lg' />
            <div className='space-y-2'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-3/4' />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      {posts.length === 0 && (
        <div className='text-center py-12'>
          <div className='text-muted-foreground mb-4'>
            <svg
              className='w-16 h-16 mx-auto mb-4 opacity-50'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1}
                d='M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z'
              />
            </svg>
          </div>
          <h3 className='text-lg font-semibold text-foreground mb-2'>No published posts yet</h3>
          <p className='text-muted-foreground'>Start writing and publish your first post!</p>
        </div>
      )}
    </div>
  );
};
