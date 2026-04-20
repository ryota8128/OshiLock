import { apiClient } from './client';
import type {
  GetProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  AvatarPresignedUrlsResponse,
  UserSettingsResponse,
  UpdateUserSettingsRequest,
} from '@oshilock/shared';

export const userApi = {
  getProfile(): Promise<GetProfileResponse> {
    return apiClient.get<GetProfileResponse>('/users/me');
  },

  getAvatarUploadUrls(): Promise<AvatarPresignedUrlsResponse> {
    return apiClient.post<AvatarPresignedUrlsResponse>('/users/me/avatar/presigned-urls');
  },

  updateProfile(body: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    return apiClient.put<UpdateProfileResponse>('/users/me/profile', body);
  },

  getSettings(): Promise<UserSettingsResponse> {
    return apiClient.get<UserSettingsResponse>('/users/me/settings');
  },

  updateSettings(body: UpdateUserSettingsRequest): Promise<UserSettingsResponse> {
    return apiClient.put<UserSettingsResponse>('/users/me/settings', body);
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
