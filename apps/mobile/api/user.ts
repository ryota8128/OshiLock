import { apiClient } from './client';
import type { UpdateProfileResponse, AvatarPresignedUrlsResponse } from '@oshilock/shared';

export const userApi = {
  getAvatarUploadUrls(): Promise<AvatarPresignedUrlsResponse> {
    return apiClient.post<AvatarPresignedUrlsResponse>('/users/me/avatar/presigned-urls');
  },

  updateProfile(body: {
    displayName: string;
    avatarPath?: string | null;
  }): Promise<UpdateProfileResponse> {
    return apiClient.put<UpdateProfileResponse>('/users/me/profile', body);
  },
};

export async function uploadToS3(presignedUrl: string, fileUri: string): Promise<void> {
  const response = await fetch(fileUri);
  const blob = await response.blob();
  await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'image/webp' },
    body: blob,
  });
}
