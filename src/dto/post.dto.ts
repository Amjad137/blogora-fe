import { POST_STATUS } from '@/constants/post.constants';
import { IBaseEntity } from '@/types/common.type';

export interface CreatePostRequestDTO {
  slug?: string;
  content: string;
  featuredImage?: string;
  status?: POST_STATUS;
  tags?: string[];
}

export interface UpdatePostRequestDTO {
  slug?: string;
  content?: string;
  featuredImage?: string | null;
  status?: POST_STATUS;
  publishedAt?: string;
  tags?: string[];
}

export interface PostResponseDTO extends IBaseEntity {
  slug: string;
  content: string;
  featuredImage?: string;
  status: POST_STATUS;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  tags?: string[];
  publishedAt?: string;
  author?: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}
