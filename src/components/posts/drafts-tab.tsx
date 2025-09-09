'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { PostResponseDTO } from '@/dto/post.dto';
import { DraftPostCard } from './draft-post-card';

interface DraftsTabProps {
  posts: PostResponseDTO[];
  isLoading: boolean;
}

export const DraftsTab = ({ posts, isLoading }: DraftsTabProps) => {
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
        <DraftPostCard key={post._id} post={post} />
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
                d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
              />
            </svg>
          </div>
          <h3 className='text-lg font-semibold text-foreground mb-2'>No drafts yet</h3>
          <p className='text-muted-foreground'>Start writing and save your first draft!</p>
        </div>
      )}
    </div>
  );
};
