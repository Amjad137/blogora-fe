import Axios from '@/config/api.config';
import {
  ICommonResponseDTO,
  IPaginatedResponseDTO,
  IBasePaginationExtras,
  IPaginationQuery,
} from '@/dto/common.dto';
import { CreatePostRequestDTO, PostResponseDTO, UpdatePostRequestDTO } from '@/dto/post.dto';
import { toast } from '@/hooks/use-toast';
import ErrorHandler from '@/utils/error-handler';
import { AxiosError } from 'axios';

export const createPost = async (postData: CreatePostRequestDTO): Promise<PostResponseDTO> => {
  try {
    const response = await Axios.post<ICommonResponseDTO<PostResponseDTO>>('/v1/posts', {
      ...postData,
    });
    return response.data.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      const { errorMessage } = ErrorHandler(err);
      toast({ title: 'Error!', description: errorMessage, variant: 'destructive' });
    }
    throw err;
  }
};

export const fetchPublishedPosts = async (
  params?: IPaginationQuery,
): Promise<IPaginatedResponseDTO<PostResponseDTO, IBasePaginationExtras>> => {
  try {
    const response = await Axios.get<
      ICommonResponseDTO<{ results: PostResponseDTO[]; pagination?: IBasePaginationExtras }>
    >('/v1/posts/published', { params });
    const payload = response.data.data;
    return {
      results: payload.results ?? [],
      extras: payload.pagination ?? {
        total: payload.results?.length ?? 0,
        limit: params?.limit ?? 20,
        skip: params?.skip ?? 0,
      },
    };
  } catch (err) {
    if (err instanceof AxiosError) {
      const { errorMessage } = ErrorHandler(err);
      toast({ title: 'Error!', description: errorMessage, variant: 'destructive' });
    }
    throw err;
  }
};

export const fetchPostBySlug = async (slug: string): Promise<PostResponseDTO> => {
  try {
    const response = await Axios.get<ICommonResponseDTO<PostResponseDTO>>(
      `/v1/posts/by-slug/${slug}`,
    );
    return response.data.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      const { errorMessage } = ErrorHandler(err);
      toast({ title: 'Error!', description: errorMessage, variant: 'destructive' });
    }
    throw err;
  }
};

export const fetchMyPosts = async (
  params?: IPaginationQuery,
): Promise<IPaginatedResponseDTO<PostResponseDTO, IBasePaginationExtras>> => {
  try {
    const response = await Axios.get<
      ICommonResponseDTO<{ results: PostResponseDTO[]; pagination?: IBasePaginationExtras }>
    >('/v1/posts/my-posts', { params });
    const payload = response.data.data;
    return {
      results: payload.results ?? [],
      extras: payload.pagination ?? {
        total: payload.results?.length ?? 0,
        limit: params?.limit ?? 20,
        skip: params?.skip ?? 0,
      },
    };
  } catch (err) {
    if (err instanceof AxiosError) {
      const { errorMessage } = ErrorHandler(err);
      toast({ title: 'Error!', description: errorMessage, variant: 'destructive' });
    }
    throw err;
  }
};

export const updatePost = async (
  postId: string,
  updates: UpdatePostRequestDTO,
): Promise<PostResponseDTO> => {
  try {
    const response = await Axios.put<ICommonResponseDTO<PostResponseDTO>>(`/v1/posts/${postId}`, {
      ...updates,
    });
    return response.data.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      const { errorMessage } = ErrorHandler(err);
      toast({ title: 'Error!', description: errorMessage, variant: 'destructive' });
    }
    throw err;
  }
};

export const publishPost = async (postId: string): Promise<PostResponseDTO> => {
  try {
    const response = await Axios.put<ICommonResponseDTO<PostResponseDTO>>(
      `/v1/posts/admin/${postId}/publish`,
    );
    return response.data.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      const { errorMessage } = ErrorHandler(err);
      toast({ title: 'Error!', description: errorMessage, variant: 'destructive' });
    }
    throw err;
  }
};

export const unpublishPost = async (postId: string): Promise<PostResponseDTO> => {
  try {
    const response = await Axios.put<ICommonResponseDTO<PostResponseDTO>>(
      `/v1/posts/admin/${postId}/unpublish`,
    );
    return response.data.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      const { errorMessage } = ErrorHandler(err);
      toast({ title: 'Error!', description: errorMessage, variant: 'destructive' });
    }
    throw err;
  }
};

export const deletePost = async (postId: string): Promise<null> => {
  try {
    const response = await Axios.delete<ICommonResponseDTO<null>>(`/v1/posts/${postId}`);
    return response.data.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      const { errorMessage } = ErrorHandler(err);
      toast({ title: 'Error!', description: errorMessage, variant: 'destructive' });
    }
    throw err;
  }
};
