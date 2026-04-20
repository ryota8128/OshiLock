import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

const AVATAR_SIZES = {
  sm: 200,
  lg: 1080,
} as const;

const IMAGE_QUALITY = 0.8;

type AvatarSize = keyof typeof AVATAR_SIZES;

type ResizeResult = {
  uri: string;
  width: number;
  height: number;
};

export async function resizeForAvatar(uri: string, size: AvatarSize): Promise<ResizeResult> {
  const px = AVATAR_SIZES[size];
  const context = ImageManipulator.manipulate(uri);
  context.resize({ width: px, height: px });
  const image = await context.renderAsync();
  const result = await image.saveAsync({ format: SaveFormat.WEBP, compress: IMAGE_QUALITY });
  return { uri: result.uri, width: result.width, height: result.height };
}

export async function resizeForContent(uri: string, maxWidth = 1080): Promise<ResizeResult> {
  const context = ImageManipulator.manipulate(uri);
  context.resize({ width: maxWidth });
  const image = await context.renderAsync();
  const result = await image.saveAsync({ format: SaveFormat.WEBP, compress: IMAGE_QUALITY });
  return { uri: result.uri, width: result.width, height: result.height };
}
