'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Bell, Home, Send } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function UserHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = (searchParams.get('tab') || 'feed') as 'feed' | 'notifications';

  const setTab = (value: 'feed' | 'notifications') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <header className={cn('sticky top-0 z-50 w-full', 'px-2 pt-2 md:px-4 md:pt-3')}>
      <div
        className={cn(
          'mx-auto max-w-4xl',
          'rounded-xl border bg-background/80 shadow-md backdrop-blur supports-[backdrop-filter]:bg-background/60',
        )}
      >
        {/* Top row: avatar + compose input + send */}
        <div className='flex items-center gap-2 p-2 md:gap-3 md:p-3'>
          <Avatar className='h-8 w-8 md:h-9 md:w-9'>
            <AvatarImage alt='User avatar' />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>

          <Input
            placeholder="What's on your mind?"
            className='h-9 flex-1 rounded-full bg-muted/60 shadow-none focus-visible:ring-2'
          />

          <Button size='icon' className='h-9 w-9 rounded-full'>
            <Send className='h-4 w-4' />
            <span className='sr-only'>Post</span>
          </Button>
        </div>

        <Separator />

        {/* Tabs row: Feed / Notifications */}
        <div className='flex items-center justify-center p-1'>
          <Tabs
            value={current}
            onValueChange={(v) => setTab(v as 'feed' | 'notifications')}
            className='w-full max-w-xs'
          >
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='feed' className='gap-1'>
                <Home className='h-4 w-4' />
                Feed
              </TabsTrigger>
              <TabsTrigger value='notifications' className='gap-1'>
                <Bell className='h-4 w-4' />
                Notifications
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </header>
  );
}
