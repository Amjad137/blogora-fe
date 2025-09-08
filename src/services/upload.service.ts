import Axios from '@/config/api.config';
import { ICommonResponseDTO } from '@/dto/common.dto';
import { AxiosAuthRefreshRequestConfig } from 'axios-auth-refresh';

export interface IPresignedUrlResponse {
  key: string;
  presignedUrl: string;
}

export interface IPublicUploadResponse extends IPresignedUrlResponse {
  publicUrl: string;
}

// Get presigned URL for secure uploads (documents, sensitive files)
export const getSecureUploadUrl = async (
  fileType: string,
  folder: string,
  keyCount = 1,
  oldKeys?: string[],
): Promise<IPresignedUrlResponse[]> => {
  const response = await Axios.post<ICommonResponseDTO<IPresignedUrlResponse[]>>(
    '/v1/s3/protected-upload',
    { fileType, folder, keyCount, oldKeys },
  );

  return response.data.data;
};

// Get presigned URL for public uploads (images)
export const getPublicUploadUrl = async (
  fileType: string,
  folder: string,
  keyCount = 1,
  oldKeys?: string[],
): Promise<IPublicUploadResponse[]> => {
  const response = await Axios.post<ICommonResponseDTO<IPublicUploadResponse[]>>(
    '/v1/s3/public-upload',
    { fileType, folder, keyCount, oldKeys },
  );

  return response.data.data;
};

// Upload file to S3 using presigned URL
export const uploadToS3 = async (
  presignedUrl: string,
  file: File,
  fileType: string,
): Promise<void> => {
  const response = await Axios.put(presignedUrl, file, {
    headers: { 'Content-Type': fileType },
    skipAuth: true,
    skipAuthRefresh: true,
  } as AxiosAuthRefreshRequestConfig);

  if (response.status !== 200) {
    throw new Error(`Upload failed: ${response.status}`);
  }
};

// Upload secure file (documents, private files)
export const uploadSecureFile = async (
  file: File,
  folder: string,
  oldKey?: string,
): Promise<{ key: string }> => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('File too large. Maximum size is 10MB.');
  }

  const uploads = await getSecureUploadUrl(file.type, folder, 1, oldKey ? [oldKey] : undefined);

  await uploadToS3(uploads[0].presignedUrl, file, file.type);

  return { key: uploads[0].key };
};

// Upload public image
export const uploadPublicImage = async (
  file: File,
  folder: string,
  oldKey?: string,
): Promise<{ key: string; url: string }> => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only JPEG, PNG, and WebP images allowed.');
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('Image too large. Maximum size is 5MB.');
  }

  const uploads = await getPublicUploadUrl(file.type, folder, 1, oldKey ? [oldKey] : undefined);

  await uploadToS3(uploads[0].presignedUrl, file, file.type);

  return {
    key: uploads[0].key,
    url: uploads[0].publicUrl,
  };
};

// Upload multiple public images
export const uploadMultiplePublicImages = async (
  files: File[],
  folder: string,
): Promise<{ uploads: { key: string; url: string }[] }> => {
  const uploads = await getPublicUploadUrl(files[0].type, folder, files.length);

  const uploadPromises = files.map((file, index) =>
    uploadToS3(uploads[index].presignedUrl, file, file.type),
  );

  await Promise.all(uploadPromises);

  return {
    uploads: uploads.map((upload) => ({
      key: upload.key,
      url: upload.publicUrl,
    })),
  };
};

// Delete files from S3
export const deleteS3Files = async (keys: string[]): Promise<void> => {
  await Axios.delete('/v1/s3/files', { data: { keys } });
};

// Get file URL (secure or public)
export const getFileUrl = async (key: string, isSecure = false): Promise<string | undefined> => {
  const response = await Axios.get(`/v1/s3/file-url/${key}?secure=${isSecure}`);
  return response.data.data?.url;
};
