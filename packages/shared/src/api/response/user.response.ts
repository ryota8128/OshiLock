import type { UserWithAvatarUrl } from '../../domain/models/user';

export type GetProfileResponse = {
  user: UserWithAvatarUrl;
};

export type UpdateProfileResponse = {
  user: UserWithAvatarUrl;
};

export type AvatarPresignedUrlsResponse = {
  avatarPath: string;
  smUploadUrl: string;
  lgUploadUrl: string;
};
