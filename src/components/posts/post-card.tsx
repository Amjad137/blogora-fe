'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PostResponseDTO } from '@/dto/post.dto';
import { LikeButton } from './like-button';
import { CommentButton } from './comment-trigger-button';
import { CommentArea } from './comment-area';
import { ShareButton } from './share-button';
import { LIKE_TYPE } from '@/dto/like.dto';
import { getUserInitials } from '@/utils/user-utils';
import { formatTimeAgo } from '@/utils/common-utils';
import Image from 'next/image';
import { IUser } from '@/types/user.type';

interface PostCardProps {
  post: PostResponseDTO;
  className?: string;
}

export function PostCard({ post, className }: PostCardProps) {
  const [showFullContent, setShowFullContent] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const shouldTruncate = post.content.length > 200;
  const displayContent =
    showFullContent || !shouldTruncate ? post.content : post.content.substring(0, 200) + '...';

  return (
    <Card className={cn('w-full', className)}>
      <CardContent className='p-4 space-y-4'>
        {/* Post Header */}
        <div className='flex items-start gap-3'>
          <Avatar className='h-10 w-10'>
            <AvatarImage src={post.author?.avatar} />
            <AvatarFallback>{getUserInitials(post.author as IUser)}</AvatarFallback>
          </Avatar>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2'>
              <h3 className='font-semibold text-sm truncate'>
                {post.author?.firstName} {post.author?.lastName}
              </h3>
            </div>
            <p className='text-xs text-muted-foreground'>{formatTimeAgo(post.createdAt)}</p>
          </div>
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className='w-full'>
            <Image
              src={post.featuredImage}
              alt='Post content'
              className='w-full h-auto rounded-lg object-cover'
              loading='lazy'
              width={1000}
              height={1000}
            />
          </div>
        )}

        {/* Post Content */}
        <div className='space-y-2'>
          <p className='text-sm leading-relaxed whitespace-pre-wrap'>{displayContent}</p>
          {shouldTruncate && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className='text-xs text-primary hover:underline'
            >
              {showFullContent ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className='flex flex-wrap gap-1'>
            {post.tags.map((tag) => (
              <Badge key={tag} variant='outline' className='text-xs'>
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Engagement Summary */}
        <div className='flex items-center justify-between text-xs text-muted-foreground'>
          <div className='flex items-center gap-2'>
            <span className='bg-primary/10 text-primary px-2 py-1 rounded-full'>
              {post.likeCount || 0} Likes
            </span>
          </div>
          <span>{post.commentCount || 0} comments</span>
        </div>

        {/* Action Buttons - Full Width */}
        <div className='flex items-center justify-between pt-3 border-t'>
          <LikeButton
            targetId={post._id}
            likeType={LIKE_TYPE.POST}
            initialCount={post.likeCount || 0}
            className='flex-1 h-8'
          />
          <CommentButton
            commentCount={post.commentCount || 0}
            onClick={() => setShowComments(!showComments)}
            className='flex-1 h-8'
          />
          <ShareButton postId={post._id} className='flex-1 h-8' />
        </div>
      </CardContent>

      {/* Comment Area - Full Width Below Card */}
      <CommentArea postId={post._id} isVisible={showComments} />
    </Card>
  );
}
