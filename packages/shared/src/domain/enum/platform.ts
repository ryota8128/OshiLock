import { z } from 'zod';

export const PLATFORM = {
  IOS: 'ios',
  ANDROID: 'android',
} as const;

export type Platform = (typeof PLATFORM)[keyof typeof PLATFORM];

export namespace Platform {
  export const schema = z.nativeEnum(PLATFORM);
}
