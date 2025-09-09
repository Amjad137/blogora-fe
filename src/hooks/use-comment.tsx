import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { IPaginationQuery, IBasePaginationExtras, IPaginatedResponseDTO } from '@/dto/common.dto';
import {
  CreateCommentRequestDTO,
  CommentResponseDTO,
  UpdateCommentRequestDTO,
} from '@/dto/comment.dto';
import {
  createComment,
  fetchCommentsByPost,
  fetchCommentById,
  fetchCommentReplies,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
} from '@/services/comment.service';
import { toast } from '@/hooks/use-toast';

export const useGetCommentsByPost = (
  postId: string,
  params?: IPaginationQuery,
  options?: { enabled?: boolean },
) => {
  const { isLoading, data, error } = useQuery<
    IPaginatedResponseDTO<CommentResponseDTO, IBasePaginationExtras>
  >({
    queryKey: ['comments', 'post', postId, params],
    queryFn: () => fetchCommentsByPost(postId, params),
    enabled: (options?.enabled ?? true) && !!postId,
  });

  return {
    isLoading,
    data,
    results: data?.results ?? [],
    extras: data?.extras ?? {
      total: 0,
      limit: params?.limit ?? 20,
      skip: params?.skip ?? 0,
    },
    error,
  };
};

export const useGetCommentsByPostInfinite = (
  postId: string,
  options?: { enabled?: boolean; limit?: number },
) => {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error } =
    useInfiniteQuery<IPaginatedResponseDTO<CommentResponseDTO, IBasePaginationExtras>>({
      queryKey: ['comments', 'post', postId, 'infinite'],
      queryFn: ({ pageParam = 0 }) =>
        fetchCommentsByPost(postId, {
          skip: pageParam as number,
          limit: options?.limit ?? 10,
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        const { skip, limit, total } = lastPage.extras;
        const nextSkip = skip + limit;
        return nextSkip < total ? nextSkip : undefined;
      },
      enabled: (options?.enabled ?? true) && !!postId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnMount: true, // Allow refetch on mount to ensure fresh data
    });

  // Flatten all pages into a single array
  const allComments = data?.pages.flatMap((page) => page.results) ?? [];

  return {
    comments: allComments,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  };
};

export const useGetCommentById = (commentId: string, options?: { enabled?: boolean }) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ['comment', commentId],
    queryFn: () => fetchCommentById(commentId),
    enabled: (options?.enabled ?? true) && !!commentId,
  });

  return {
    isLoading,
    data: data ?? null,
    error,
  };
};

export const useGetCommentReplies = (commentId: string, options?: { enabled?: boolean }) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ['comment', commentId, 'replies'],
    queryFn: () => fetchCommentReplies(commentId),
    enabled: (options?.enabled ?? true) && !!commentId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  return {
    isLoading,
    replies: data ?? [],
    error,
  };
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentData }: { commentData: CreateCommentRequestDTO }) =>
      createComment(commentData),
    onMutate: () => {
      toast({ title: 'Creating', description: 'Creating comment...' });
    },
    onSuccess: (data) => {
      toast({ title: 'Success', description: 'Comment created successfully' });

      // Invalidate both regular and infinite comment queries
      queryClient.invalidateQueries({ queryKey: ['comments', 'post', data.post] });
      queryClient.invalidateQueries({ queryKey: ['comments', 'post', data.post, 'infinite'] });
      // Invalidate posts to update comment count
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create comment. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, updates }: { commentId: string; updates: UpdateCommentRequestDTO }) =>
      updateComment(commentId, updates),
    onMutate: () => {
      toast({ title: 'Updating', description: 'Updating comment...' });
    },
    onSuccess: (data) => {
      toast({ title: 'Success', description: 'Comment updated successfully' });
      queryClient.invalidateQueries({ queryKey: ['comment', data._id] });
      queryClient.invalidateQueries({ queryKey: ['comments', 'post', data.post] });
      queryClient.invalidateQueries({ queryKey: ['comments', 'post', data.post, 'infinite'] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update comment. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId }: { commentId: string }) => deleteComment(commentId),
    onMutate: () => {
      toast({ title: 'Deleting', description: 'Deleting comment...' });
    },
    onSuccess: (data, { commentId }) => {
      toast({ title: 'Success', description: 'Comment deleted successfully' });
      queryClient.invalidateQueries({ queryKey: ['comment', commentId] });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      // Invalidate infinite queries for all posts (since we don't know which post)
      queryClient.invalidateQueries({ queryKey: ['comments', 'post'] });
      // Invalidate posts to update comment count
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete comment. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useLikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId }: { commentId: string }) => likeComment(commentId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comment', data._id] });
      queryClient.invalidateQueries({ queryKey: ['comments', 'post', data.post] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to like comment. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useUnlikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId }: { commentId: string }) => unlikeComment(commentId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comment', data._id] });
      queryClient.invalidateQueries({ queryKey: ['comments', 'post', data.post] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to unlike comment. Please try again.',
        variant: 'destructive',
      });
    },
  });
};
