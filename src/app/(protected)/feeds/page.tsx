'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { PostCard } from '@/components/posts/post-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PaginationWithLinks } from '@/components/ui/data-table/pagination';
import { useGetPublishedPosts } from '@/hooks/use-post';
import { useDebounce } from '@/hooks/use-debounce';
import { API_QUERY_PARAMS, COMMON_SORT, ENTITY_SORT } from '@/constants/common.constants';
import { IPaginationQuery } from '@/dto/common.dto';

const FeedsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // Debounce the search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Build query parameters for pagination and search
  const queryParams: IPaginationQuery = {
    search_key: searchParams?.get(API_QUERY_PARAMS.SEARCH_KEY) ?? undefined,
    sort_by: (searchParams?.get(API_QUERY_PARAMS.SORT_BY) as COMMON_SORT) ?? COMMON_SORT.DATE,
    sort_order: (searchParams?.get(API_QUERY_PARAMS.SORT_ORDER) as ENTITY_SORT) ?? ENTITY_SORT.DESC,
    skip: searchParams?.get(API_QUERY_PARAMS.SKIP)
      ? Number(searchParams.get(API_QUERY_PARAMS.SKIP))
      : 0,
    limit: searchParams?.get(API_QUERY_PARAMS.LIMIT)
      ? Number(searchParams.get(API_QUERY_PARAMS.LIMIT))
      : 10,
  };

  const { results: posts, isLoading, extras } = useGetPublishedPosts(queryParams);

  // Handle input changes (immediate UI update)
  const handleSearchInput = (query: string) => {
    setSearchQuery(query);
  };

  // Update URL when debounced search query changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (debouncedSearchQuery.trim()) {
      params.set(API_QUERY_PARAMS.SEARCH_KEY, debouncedSearchQuery.trim());
    } else {
      params.delete(API_QUERY_PARAMS.SEARCH_KEY);
    }

    // Reset pagination when searching
    params.delete(API_QUERY_PARAMS.SKIP);

    router.replace(`${pathname}?${params.toString()}`);
  }, [debouncedSearchQuery, searchParams, router, pathname]);

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    router.replace(pathname);
  };

  if (isLoading) {
    return (
      <div className='max-w-2xl mx-auto space-y-6 p-4'>
        <div className='space-y-6'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='rounded-lg p-4 space-y-4 border'>
              <div className='flex items-center gap-3'>
                <Skeleton className='h-10 w-10 rounded-full' />
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-32' />
                  <Skeleton className='h-3 w-20' />
                </div>
              </div>
              <Skeleton className='h-48 w-full rounded-lg' />
              <div className='space-y-2'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-3/4' />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-2xl mx-auto space-y-6 p-4'>
      {/* Search Bar */}
      <div className='sticky top-4 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-lg p-4 shadow-sm'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
          <Input
            placeholder='Search posts by content, title, or tags...'
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            className='pl-10 pr-10 h-10'
          />
          {searchQuery && (
            <Button
              variant='ghost'
              size='sm'
              onClick={clearSearch}
              className='absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted'
            >
              <X className='h-4 w-4' />
            </Button>
          )}
        </div>
        {queryParams.search_key && (
          <div className='mt-2 text-sm text-muted-foreground'>
            Searching for:{' '}
            <span className='font-medium text-foreground'>
              &ldquo;{queryParams.search_key}&rdquo;
            </span>
          </div>
        )}
      </div>

      <div className='space-y-6'>
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <div className='text-center py-12'>
          <div className='text-muted-foreground mb-4'>
            {queryParams.search_key ? (
              <Search className='w-16 h-16 mx-auto mb-4 opacity-50' />
            ) : (
              <svg
                className='w-16 h-16 mx-auto mb-4 opacity-50'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1}
                  d='M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z'
                />
              </svg>
            )}
          </div>
          <h3 className='text-lg font-semibold text-foreground mb-2'>
            {queryParams.search_key ? 'No posts found' : 'No posts yet'}
          </h3>
          <p className='text-muted-foreground'>
            {queryParams.search_key
              ? `No posts match your search for &ldquo;${queryParams.search_key}&rdquo;. Try different keywords.`
              : 'Be the first to share something with your community!'}
          </p>
          {queryParams.search_key && (
            <Button variant='outline' onClick={clearSearch} className='mt-4'>
              Clear Search
            </Button>
          )}
        </div>
      )}

      {/* Pagination */}
      {posts.length > 0 && extras && (
        <PaginationWithLinks
          skip={queryParams.skip || 0}
          limit={queryParams.limit || 10}
          totalCount={extras.total}
          isTable={false}
        />
      )}
    </div>
  );
};

export default FeedsPage;
