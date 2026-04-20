import { z } from 'zod';

export const signInRequestSchema = z.object({
  idToken: z.string().min(1),
});

export type SignInRequest = z.input<typeof signInRequestSchema>;
