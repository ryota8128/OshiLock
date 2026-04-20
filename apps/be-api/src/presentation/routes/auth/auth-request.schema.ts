import { z } from "zod";

export const signInRequestSchema = z.object({
  idToken: z.string().min(1),
});
