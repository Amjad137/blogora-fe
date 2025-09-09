'use client';

import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommentButtonProps {
  commentCount: number;
  onClick: () => void;
  className?: string;
}

export function CommentButton({ commentCount, onClick, className }: CommentButtonProps) {
  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={onClick}
      className={cn(
        'flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors px-0 h-auto',
        className,
      )}
    >
      <MessageCircle className='h-4 w-4' />
      <span className='text-sm font-medium'>
        {commentCount > 0 ? `${commentCount} comments` : 'Comment'}
      </span>
    </Button>
  );
}
