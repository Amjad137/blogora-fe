import { IBaseEntity } from '@/types/common.type';

export enum COMMENT_STATUS {
  ACTIVE = 'ACTIVE',
  SPAM = 'SPAM',
}

export interface CommentResponseDTO extends IBaseEntity {
  content: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  post: string; // Post ID
  parent?: string; // Parent comment ID for replies
  status: COMMENT_STATUS;
  likeCount: number;
  replyCount: number;
}

export interface CreateCommentRequestDTO {
  content: string;
  post: string;
  parent?: string; // For replies
}

export interface UpdateCommentRequestDTO {
  content?: string;
  status?: COMMENT_STATUS;
}
