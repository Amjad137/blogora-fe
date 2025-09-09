import { mixed } from 'yup';

/**
 * Extract S3 key from a public S3 URL
 * @param url - The S3 URL (e.g., "https://bucket.s3.region.amazonaws.com/public/profile-images/123.jpg")
 * @returns The S3 key (e.g., "public/profile-images/123.jpg") or undefined if not a valid S3 URL
 */
export const extractS3KeyFromUrl = (url: string | null | undefined): string | undefined => {
  if (!url || typeof url !== 'string') {
    return undefined;
  }

  try {
    // Handle S3 URLs in format: https://bucket.s3.region.amazonaws.com/key
    if (url.includes('.s3.') && url.includes('.amazonaws.com/')) {
      const urlObj = new URL(url);
      // Extract everything after the domain as the key
      const key = urlObj.pathname.substring(1); // Remove leading slash
      return key || undefined;
    }

    return undefined;
  } catch (error) {
    console.warn('Failed to extract S3 key from URL:', url, error);
    return undefined;
  }
};

export const fileValidation = (allowEmptyValues?: boolean) => {
  return mixed<File[]>().test(
    'is-image',
    'Invalid file format, should be jpg, jpeg, png or pdf',
    (value) => {
      if (allowEmptyValues && (!value || value.length === 0)) {
        return true;
      } else if (!value || value.length === 0) {
        return false;
      }

      const fileExtensions = ['jpg', 'jpeg', 'png', 'pdf'];
      return Array.from(value).every((file) =>
        fileExtensions.includes(file.name.split('.').pop()?.toLowerCase() as string),
      );
    },
  );
};
