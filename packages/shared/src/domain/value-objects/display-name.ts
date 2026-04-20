import { z } from 'zod';

const MIN_LENGTH = 2;
const MAX_LENGTH = 20;

export namespace DisplayName {
  export const minLength = MIN_LENGTH;
  export const maxLength = MAX_LENGTH;
  export const schema = z.string().min(MIN_LENGTH).max(MAX_LENGTH);
}
