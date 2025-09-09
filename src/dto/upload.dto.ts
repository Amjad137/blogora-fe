// Upload-related DTOs for frontend

export interface IPresignedUrlResponse {
  key: string;
  presignedUrl: string;
}

export interface IPublicUploadResponse extends IPresignedUrlResponse {
  publicUrl: string;
}

export interface IUploadRequest {
  fileType: string;
  folder: string;
  keyCount?: number;
  oldKeys?: string[];
}

export interface IDeleteFilesRequest {
  keys: string[];
}

export interface IFileUrlResponse {
  url?: string;
}

// Response wrapper for upload endpoints
export interface IUploadResponseWrapper<T> {
  results: T[];
}
