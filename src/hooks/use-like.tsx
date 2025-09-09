import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getPostLikeCount,
  getCommentLikeCount,
  likePost,
  unlikePost,
  likeComment,
  unlikeComment,
} from '@/services/like.service';
import { LIKE_TYPE } from '@/dto/like.dto';
import { toast } from '@/hooks/use-toast';

export const useLike = (
  targetId: string,
  likeType: LIKE_TYPE,
  initialCount = 0,
  initialIsLiked = false,
) => {
  const queryClient = useQueryClient();

  // Get like count and status
  const { data: likeData, isLoading } = useQuery({
    queryKey: ['like', targetId, likeType],
    queryFn: () => {
      if (likeType === LIKE_TYPE.POST) {
        return getPostLikeCount(targetId);
      } else {
        return getCommentLikeCount(targetId);
      }
    },
    enabled: !!targetId, // Only run query if targetId exists
    staleTime: 10 * 60 * 1000, // Consider data fresh for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
  });

  // Toggle like mutation
  const toggleLikeMutation = useMutation({
    mutationFn: async () => {
      const currentData = likeData || { count: initialCount, isLiked: initialIsLiked };

      if (likeType === LIKE_TYPE.POST) {
        if (currentData.isLiked) {
          await unlikePost(targetId);
        } else {
          await likePost(targetId);
        }
        return await getPostLikeCount(targetId);
      } else {
        if (currentData.isLiked) {
          await unlikeComment(targetId);
        } else {
          await likeComment(targetId);
        }
        return await getCommentLikeCount(targetId);
      }
    },
    onMutate: () => {
      // Optimistic update
      const previousData = queryClient.getQueryData(['like', targetId, likeType]);
      const currentData = likeData || { count: initialCount, isLiked: initialIsLiked };
      const newIsLiked = !currentData.isLiked;
      const newCount = newIsLiked ? currentData.count + 1 : Math.max(0, currentData.count - 1);

      queryClient.setQueryData(['like', targetId, likeType], {
        count: newCount,
        isLiked: newIsLiked,
      });

      return { previousData, currentData };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['like', targetId, likeType], data);

      // Invalidate posts queries to update the denormalized counts
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error, variables, context) => {
      // Revert optimistic update
      if (context?.previousData) {
        queryClient.setQueryData(['like', targetId, likeType], context.previousData);
      }

      toast({
        title: 'Error',
        description: 'Failed to update like. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return {
    likeData: likeData || { count: initialCount, isLiked: initialIsLiked },
    toggleLike: toggleLikeMutation.mutate,
    isToggling: toggleLikeMutation.isPending,
    isLoading,
  };
};
