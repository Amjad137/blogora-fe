import { IBaseEntity } from '@/types/common.type';

export enum LIKE_TYPE {
  POST = 'POST',
  COMMENT = 'COMMENT',
}

export interface LikeResponseDTO extends IBaseEntity {
  user: string; // User ID
  likeType: LIKE_TYPE;
  targetId: string; // Post or Comment ID
  uniqueKey: string;
}

export interface CreateLikeRequestDTO {
  likeType: LIKE_TYPE;
  targetId: string;
}

export interface LikeCountResponseDTO {
  count: number;
  isLiked: boolean;
}

// Request DTOs for API calls
export interface LikePostRequestDTO {
  postId: string;
}

export interface LikeCommentRequestDTO {
  commentId: string;
}

export interface UnlikePostRequestDTO {
  postId: string;
}

export interface UnlikeCommentRequestDTO {
  commentId: string;
}
