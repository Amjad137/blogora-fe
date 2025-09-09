import Axios from '@/config/api.config';
import {
  ICommonResponseDTO,
  IPaginatedResponseDTO,
  IBasePaginationExtras,
  IPaginationQuery,
} from '@/dto/common.dto';
import {
  CreateCommentRequestDTO,
  CommentResponseDTO,
  UpdateCommentRequestDTO,
} from '@/dto/comment.dto';
import { toast } from '@/hooks/use-toast';
import ErrorHandler from '@/utils/error-handler';
import { AxiosError } from 'axios';

export const createComment = async (
  commentData: CreateCommentRequestDTO,
): Promise<CommentResponseDTO> => {
  try {
    const response = await Axios.post<ICommonResponseDTO<CommentResponseDTO>>('/v1/comments', {
      ...commentData,
    });
    return response.data.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      const { errorMessage } = ErrorHandler(err);
      toast({
        title: 'Error!',
        description: errorMessage,
        variant: 'destructive',
      });
    }
    throw err;
  }
};

export const fetchCommentsByPost = async (
  postId: string,
  params?: IPaginationQuery,
): Promise<IPaginatedResponseDTO<CommentResponseDTO, IBasePaginationExtras>> => {
  try {
    const response = await Axios.get<
      ICommonResponseDTO<{ results: CommentResponseDTO[]; pagination?: IBasePaginationExtras }>
    >(`/v1/comments/post/${postId}`, { params });
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
      toast({
        title: 'Error!',
        description: errorMessage,
        variant: 'destructive',
      });
    }
    throw err;
  }
};

export const fetchCommentReplies = async (commentId: string): Promise<CommentResponseDTO[]> => {
  try {
    const response = await Axios.get<
      ICommonResponseDTO<{ results: CommentResponseDTO[]; pagination?: IBasePaginationExtras }>
    >(`/v1/comments/${commentId}/replies`);
    const payload = response.data.data;
    return payload.results ?? [];
  } catch (err) {
    if (err instanceof AxiosError) {
      const { errorMessage } = ErrorHandler(err);
      toast({
        title: 'Error!',
        description: errorMessage,
        variant: 'destructive',
      });
    }
    throw err;
  }
};

export const fetchCommentById = async (commentId: string): Promise<CommentResponseDTO> => {
  try {
    const response = await Axios.get<ICommonResponseDTO<CommentResponseDTO>>(
      `/v1/comments/${commentId}`,
    );
    return response.data.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      const { errorMessage } = ErrorHandler(err);
      toast({
        title: 'Error!',
        description: errorMessage,
        variant: 'destructive',
      });
    }
    throw err;
  }
};

export const updateComment = async (
  commentId: string,
  updateData: UpdateCommentRequestDTO,
): Promise<CommentResponseDTO> => {
  try {
    const response = await Axios.patch<ICommonResponseDTO<CommentResponseDTO>>(
      `/v1/comments/${commentId}`,
      {
        ...updateData,
      },
    );
    return response.data.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      const { errorMessage } = ErrorHandler(err);
      toast({
        title: 'Error!',
        description: errorMessage,
        variant: 'destructive',
      });
    }
    throw err;
  }
};

export const deleteComment = async (commentId: string): Promise<void> => {
  try {
    await Axios.delete<ICommonResponseDTO<null>>(`/v1/comments/${commentId}`);
  } catch (err) {
    if (err instanceof AxiosError) {
      const { errorMessage } = ErrorHandler(err);
      toast({
        title: 'Error!',
        description: errorMessage,
        variant: 'destructive',
      });
    }
    throw err;
  }
};

export const likeComment = async (commentId: string): Promise<CommentResponseDTO> => {
  try {
    const response = await Axios.patch<ICommonResponseDTO<CommentResponseDTO>>(
      `/v1/comments/${commentId}/like`,
    );
    return response.data.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      const { errorMessage } = ErrorHandler(err);
      toast({
        title: 'Error!',
        description: errorMessage,
        variant: 'destructive',
      });
    }
    throw err;
  }
};

export const unlikeComment = async (commentId: string): Promise<CommentResponseDTO> => {
  try {
    const response = await Axios.patch<ICommonResponseDTO<CommentResponseDTO>>(
      `/v1/comments/${commentId}/unlike`,
    );
    return response.data.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      const { errorMessage } = ErrorHandler(err);
      toast({
        title: 'Error!',
        description: errorMessage,
        variant: 'destructive',
      });
    }
    throw err;
  }
};
