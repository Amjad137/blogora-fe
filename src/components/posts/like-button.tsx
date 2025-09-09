'use client';

import { Button } from '@/components/ui/button';
import { ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LIKE_TYPE } from '@/dto/like.dto';
import { useLike } from '@/hooks/use-like';

interface LikeButtonProps {
  targetId: string;
  likeType: LIKE_TYPE;
  initialCount?: number;
  initialIsLiked?: boolean;
  className?: string;
}

export function LikeButton({
  targetId,
  likeType,
  initialCount = 0,
  initialIsLiked = false,
  className,
}: LikeButtonProps) {
  const { likeData, toggleLike, isToggling, isLoading } = useLike(
    targetId,
    likeType,
    initialCount,
    initialIsLiked,
  );

  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={() => toggleLike()}
      disabled={isToggling || isLoading}
      loading={isLoading}
      className={cn(
        'flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors px-0 h-auto',
        likeData.isLiked && 'text-primary',
        className,
      )}
    >
      <ThumbsUp className={cn('h-4 w-4 transition-colors', likeData.isLiked && 'fill-current')} />
      <span className='text-sm font-medium'>{likeData.count > 0 ? likeData.count : 'Like'}</span>
    </Button>
  );
}
