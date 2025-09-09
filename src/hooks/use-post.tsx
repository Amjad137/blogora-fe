import { IPaginationQuery, IBasePaginationExtras, IPaginatedResponseDTO } from '@/dto/common.dto';
import { CreatePostRequestDTO, PostResponseDTO, UpdatePostRequestDTO } from '@/dto/post.dto';
import {
  createPost,
  deletePost,
  fetchMyPosts,
  fetchPostBySlug,
  fetchPublishedPosts,
  publishPost,
  unpublishPost,
  updatePost,
} from '@/services/post.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

export const useGetPublishedPosts = (
  params?: IPaginationQuery,
  options?: { enabled?: boolean },
) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ['posts', 'published', params],
    queryFn: () => fetchPublishedPosts(params),
    enabled: options?.enabled ?? true,
  });
  const payload: IPaginatedResponseDTO<PostResponseDTO, IBasePaginationExtras> | undefined = data;
  return {
    isLoading,
    data: payload,
    results: payload?.results ?? [],
    extras: payload?.extras ?? {
      total: 0,
      limit: params?.limit ?? 20,
      skip: params?.skip ?? 0,
    },
    error,
  };
};

export const useGetMyPosts = (params?: IPaginationQuery, options?: { enabled?: boolean }) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ['posts', 'me', params],
    queryFn: () => fetchMyPosts(params),
    enabled: options?.enabled ?? true,
  });
  const payload: IPaginatedResponseDTO<PostResponseDTO, IBasePaginationExtras> | undefined = data;
  return {
    isLoading,
    data: payload,
    results: payload?.results ?? [],
    extras: payload?.extras ?? {
      total: 0,
      limit: params?.limit ?? 20,
      skip: params?.skip ?? 0,
    },
    error,
  };
};

export const useGetPostBySlug = (slug: string, options?: { enabled?: boolean }) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ['post', 'slug', slug],
    queryFn: () => fetchPostBySlug(slug),
    enabled: (options?.enabled ?? true) && !!slug,
  });

  return {
    isLoading,
    data: (data as PostResponseDTO) ?? null,
    error,
  };
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postData }: { postData: CreatePostRequestDTO }) => createPost(postData),
    onMutate: () => {
      toast({ title: 'Creating', description: 'Creating post...' });
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Post created successfully' });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'published'] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'me'] });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, updates }: { postId: string; updates: UpdatePostRequestDTO }) =>
      updatePost(postId, updates),
    onMutate: () => {
      toast({ title: 'Updating', description: 'Updating post...' });
    },
    onSuccess: (data) => {
      toast({ title: 'Success', description: 'Post updated successfully' });
      queryClient.invalidateQueries({ queryKey: ['post', 'slug', data.slug] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'published'] });
    },
  });
};

export const usePublishPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId }: { postId: string }) => publishPost(postId),
    onMutate: () => {
      toast({ title: 'Publishing', description: 'Publishing post...' });
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Post published successfully' });
      queryClient.invalidateQueries({ queryKey: ['posts', 'published'] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'me'] });
    },
  });
};

export const useUnpublishPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId }: { postId: string }) => unpublishPost(postId),
    onMutate: () => {
      toast({ title: 'Unpublishing', description: 'Unpublishing post...' });
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Post unpublished successfully' });
      queryClient.invalidateQueries({ queryKey: ['posts', 'published'] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'me'] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId }: { postId: string }) => deletePost(postId),
    onMutate: () => {
      toast({ title: 'Deleting', description: 'Deleting post...' });
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Post deleted successfully' });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'published'] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'me'] });
    },
  });
};
