import Axios from '@/config/api.config';
import { ICommonResponseDTO } from '@/dto/common.dto';
import { CreateLikeRequestDTO, LikeCountResponseDTO, LikeResponseDTO } from '@/dto/like.dto';
import { toast } from '@/hooks/use-toast';
import ErrorHandler from '@/utils/error-handler';
import { AxiosError } from 'axios';

export const likePost = async (postId: string): Promise<LikeResponseDTO> => {
  try {
    const response = await Axios.post<ICommonResponseDTO<LikeResponseDTO>>('/v1/likes/post', {
      postId,
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

export const unlikePost = async (postId: string): Promise<void> => {
  try {
    await Axios.delete('/v1/likes/post', { data: { postId } });
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

export const likeComment = async (commentId: string): Promise<LikeResponseDTO> => {
  try {
    const response = await Axios.post<ICommonResponseDTO<LikeResponseDTO>>('/v1/likes/comment', {
      commentId,
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

export const unlikeComment = async (commentId: string): Promise<void> => {
  try {
    await Axios.delete('/v1/likes/comment', { data: { commentId } });
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

export const getPostLikeCount = async (postId: string): Promise<LikeCountResponseDTO> => {
  try {
    const response = await Axios.get<ICommonResponseDTO<LikeCountResponseDTO>>(
      `/v1/likes/post/${postId}/count`,
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

export const getCommentLikeCount = async (commentId: string): Promise<LikeCountResponseDTO> => {
  try {
    const response = await Axios.get<ICommonResponseDTO<LikeCountResponseDTO>>(
      `/v1/likes/comment/${commentId}/count`,
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

// Legacy function for backward compatibility
export const toggleLike = async (likeData: CreateLikeRequestDTO): Promise<LikeCountResponseDTO> => {
  try {
    if (likeData.likeType === 'POST') {
      const isLiked = await getPostLikeCount(likeData.targetId);
      if (isLiked.isLiked) {
        await unlikePost(likeData.targetId);
      } else {
        await likePost(likeData.targetId);
      }
      return await getPostLikeCount(likeData.targetId);
    } else {
      const isLiked = await getCommentLikeCount(likeData.targetId);
      if (isLiked.isLiked) {
        await unlikeComment(likeData.targetId);
      } else {
        await likeComment(likeData.targetId);
      }
      return await getCommentLikeCount(likeData.targetId);
    }
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

// Legacy function for backward compatibility
export const getLikeCount = async (
  targetId: string,
  likeType: string,
): Promise<LikeCountResponseDTO> => {
  try {
    if (likeType === 'POST') {
      return await getPostLikeCount(targetId);
    } else {
      return await getCommentLikeCount(targetId);
    }
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
