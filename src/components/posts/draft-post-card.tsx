'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PostResponseDTO } from '@/dto/post.dto';
import CreatePostDialog from './create-post-dialog';

interface DraftPostCardProps {
  post: PostResponseDTO;
}

export const DraftPostCard = ({ post }: DraftPostCardProps) => {
  return (
    <Card className='w-full'>
      <CardContent className='p-4 space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='h-10 w-10 rounded-full bg-muted flex items-center justify-center'>
              <span className='text-sm font-medium'>D</span>
            </div>
            <div>
              <p className='text-sm font-medium'>Draft</p>
              <p className='text-xs text-muted-foreground'>
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full'>
              Draft
            </span>
          </div>
        </div>

        {post.featuredImage && (
          <div className='aspect-video w-full overflow-hidden rounded-lg bg-muted relative'>
            <Image src={post.featuredImage} alt='Draft featured' fill className='object-cover' />
          </div>
        )}

        <div className='space-y-2'>
          <h3 className='font-medium line-clamp-2'>{post.content.substring(0, 100)}...</h3>
          {post.tags && post.tags.length > 0 && (
            <div className='flex flex-wrap gap-1'>
              {post.tags.map((tag, index) => (
                <span key={`${tag}-${index}`} className='text-xs bg-muted px-2 py-1 rounded-full'>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className='flex items-center justify-between pt-2 border-t'>
          <div className='flex items-center gap-4 text-sm text-muted-foreground'>
            <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
            {post.updatedAt !== post.createdAt && (
              <span>Updated: {new Date(post.updatedAt).toLocaleDateString()}</span>
            )}
          </div>
          <CreatePostDialog editPost={post}>
            <Button variant='outline' size='sm' className='text-sm'>
              Edit Draft
            </Button>
          </CreatePostDialog>
        </div>
      </CardContent>
    </Card>
  );
};
