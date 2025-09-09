'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import UserAvatarDropdown from '../sidebar/user-avatar-dropdown';
import CreatePostDialog from '../posts/create-post-dialog';

export function UserHeader() {
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <header className={cn('sticky top-0 z-50 w-full', 'px-2 pt-2 md:px-4 md:pt-3')}>
      <div
        className={cn(
          'mx-auto max-w-2xl',
          'rounded-xl border bg-background/80 shadow-md backdrop-blur supports-[backdrop-filter]:bg-background/60',
        )}
      >
        <div className='flex items-center gap-2 p-2 md:gap-3 md:p-3'>
          <UserAvatarDropdown
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
            userHeader={true}
          />

          <CreatePostDialog>
            <Button
              variant='outline'
              className='h-10 flex-1 justify-start rounded-full font-normal bg-muted/60 text-muted-foreground hover:bg-muted/70'
            >
              {`What's on your mind, there?`}
            </Button>
          </CreatePostDialog>
        </div>
      </div>
    </header>
  );
}
