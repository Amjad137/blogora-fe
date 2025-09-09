'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CommentResponseDTO } from '@/dto/comment.dto';
import { formatTimeAgo } from '@/utils/common-utils';
import { LikeButton } from './like-button';
import { LIKE_TYPE } from '@/dto/like.dto';
import { useGetCommentReplies } from '@/hooks/use-comment';
import { Skeleton } from '@/components/ui/skeleton';
import { IUser } from '@/types/user.type';
import { getUserInitials } from '@/utils/user-utils';

interface CommentItemProps {
  readonly comment: CommentResponseDTO;
  readonly onReply: (commentId: string) => void;
  readonly level?: number;
}

export function CommentItem({ comment, onReply, level = 0 }: Readonly<CommentItemProps>) {
  const [showReplies, setShowReplies] = useState(false);
  const [hasLoadedReplies, setHasLoadedReplies] = useState(false);

  const hasReplies = (comment.replyCount || 0) > 0;
  const isReply = level > 0;

  // Fetch replies only when needed
  const { replies, isLoading: isLoadingReplies } = useGetCommentReplies(comment._id, {
    enabled: showReplies && hasLoadedReplies,
  });

  // Ensure replies is always an array
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const safeReplies = Array.isArray(replies) ? replies : [];

  return (
    <div className={cn('space-y-2', isReply && 'ml-8 border-l-2 border-gray-100 pl-4')}>
      {/* Main Comment */}
      <div className='flex gap-3'>
        <Avatar className='h-8 w-8 flex-shrink-0'>
          <AvatarImage src={comment.author?.avatar} />
          <AvatarFallback className='text-xs'>
            {getUserInitials(comment.author as IUser)}
          </AvatarFallback>
        </Avatar>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2 mb-1'>
            <span className='font-medium text-sm'>
              {comment.author?.firstName} {comment.author?.lastName}
            </span>
            <span className='text-xs text-muted-foreground'>
              {formatTimeAgo(comment.createdAt)}
            </span>
          </div>
          <p className='text-sm text-foreground leading-relaxed mb-2'>{comment.content}</p>

          {/* Comment Actions */}
          <div className='flex items-center gap-4'>
            <LikeButton
              targetId={comment._id}
              likeType={LIKE_TYPE.COMMENT}
              initialCount={comment.likeCount || 0}
              className='text-xs'
            />
            {/* Only show reply button for root comments (level 0) */}
            {level === 0 && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => onReply(comment._id)}
                className='text-xs text-muted-foreground hover:text-primary px-0 h-auto'
              >
                <MessageCircle className='h-3 w-3 mr-1' />
                Reply
              </Button>
            )}
            {hasReplies && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => {
                  if (!hasLoadedReplies) {
                    setHasLoadedReplies(true);
                  }
                  setShowReplies(!showReplies);
                }}
                className='text-xs text-muted-foreground hover:text-primary px-0 h-auto flex items-center gap-1'
              >
                {showReplies ? (
                  <ChevronDown className='h-3 w-3' />
                ) : (
                  <ChevronRight className='h-3 w-3' />
                )}
                {showReplies ? 'Hide' : 'Show'} {comment.replyCount}{' '}
                {comment.replyCount === 1 ? 'reply' : 'replies'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Replies */}
      {hasReplies && showReplies && (
        <div className='space-y-2 mt-3'>
          {isLoadingReplies ? (
            <div className='space-y-2'>
              {[1, 2].map((i) => (
                <div key={i} className='flex gap-3'>
                  <Skeleton className='h-6 w-6 rounded-full' />
                  <div className='flex-1 space-y-1'>
                    <div className='flex items-center gap-2'>
                      <Skeleton className='h-3 w-20' />
                      <Skeleton className='h-2 w-12' />
                    </div>
                    <Skeleton className='h-3 w-full' />
                    <Skeleton className='h-3 w-3/4' />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            safeReplies.map((reply) => (
              <CommentItem key={reply._id} comment={reply} onReply={onReply} level={level + 1} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
