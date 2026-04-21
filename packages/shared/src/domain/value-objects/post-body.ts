import { z } from 'zod';

const MIN_LENGTH = 1;
const MAX_LENGTH = 500;

export namespace PostBody {
  export const minLength = MIN_LENGTH;
  export const maxLength = MAX_LENGTH;
  export const schema = z.string().min(MIN_LENGTH).max(MAX_LENGTH).trim();
}
