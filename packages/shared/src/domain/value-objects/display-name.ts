import { z } from 'zod';

const MIN_LENGTH = 2;
const MAX_LENGTH = 20;

export namespace DisplayName {
  export const schema = z.string().min(MIN_LENGTH).max(MAX_LENGTH);
}
