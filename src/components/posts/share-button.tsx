'use client';

import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShareButtonProps {
  postId: string;
  className?: string;
}

export function ShareButton({ postId, className }: ShareButtonProps) {
  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Share post:', postId);
  };

  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={handleShare}
      className={cn(
        'flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors px-0 h-auto',
        className,
      )}
    >
      <Share2 className='h-4 w-4' />
      <span className='text-sm font-medium'>Share</span>
    </Button>
  );
}
