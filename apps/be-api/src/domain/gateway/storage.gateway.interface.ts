export type AvatarPresignedUploadUrls = {
  avatarPath: string;
  smUploadUrl: string;
  lgUploadUrl: string;
};

export type AvatarSignedDisplayUrls = {
  avatarSmUrl: string;
  avatarLgUrl: string;
};

export interface IStorageGateway {
  generateAvatarUploadUrls(userId: string): Promise<AvatarPresignedUploadUrls>;
  generateAvatarDisplayUrls(avatarPath: string): AvatarSignedDisplayUrls;
  deleteAvatarImages(avatarPath: string): Promise<void>;
}
