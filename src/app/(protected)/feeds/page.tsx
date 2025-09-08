type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const FeedsPage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const rawTab = params?.tab;
  const tabParam = Array.isArray(rawTab) ? rawTab[0] : rawTab || 'feed';
  const tab = tabParam === 'notifications' ? 'notifications' : 'feed';

  if (tab === 'notifications') {
    return (
      <div className='mx-auto max-w-3xl'>
        <div className='rounded-lg border bg-background p-4 text-sm text-muted-foreground'>
          Notifications coming soon.
        </div>
      </div>
    );
  }

  return <div className='flex items-center justify-center'>FeedsPage</div>;
};

export default FeedsPage;
