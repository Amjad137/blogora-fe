'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetMyPosts } from '@/hooks/use-post';
import { MyPostsTab } from '@/components/posts/my-posts-tab';
import { DraftsTab } from '@/components/posts/drafts-tab';
import { ROUTES } from '@/constants/routes.constants';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('my-posts');
  const router = useRouter();

  // Fetch user's posts (both published and drafts)
  const { results: myPosts, isLoading: isLoadingMyPosts } = useGetMyPosts();

  const handleBackToFeeds = () => {
    router.push(ROUTES.FEEDS);
  };

  // Separate published posts and drafts
  const publishedPosts = myPosts?.filter((post) => post.status === 'PUBLISHED') ?? [];
  const draftPosts = myPosts?.filter((post) => post.status === 'DRAFT') ?? [];

  return (
    <div className='max-w-2xl mx-auto space-y-6 p-4'>
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
          <p className='text-muted-foreground'>Manage your posts and drafts</p>
        </div>
        <Button
          variant='default'
          size='sm'
          onClick={handleBackToFeeds}
          className='h-10 w-10 rounded-full p-0'
        >
          <ArrowLeft className='h-4 w-4' />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='my-posts'>My Posts ({publishedPosts.length})</TabsTrigger>
          <TabsTrigger value='drafts'>Drafts ({draftPosts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value='my-posts' className='space-y-6'>
          <MyPostsTab posts={publishedPosts} isLoading={isLoadingMyPosts} />
        </TabsContent>

        <TabsContent value='drafts' className='space-y-6'>
          <DraftsTab posts={draftPosts} isLoading={isLoadingMyPosts} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
