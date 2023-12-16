import { z } from "zod";

export interface TAccessToken {
  email: string;
  userId: string;
}

export const AccessTokenSchema: z.ZodType<TAccessToken> = z.object({
  email: z.string(),
  userId: z.string(),
});
