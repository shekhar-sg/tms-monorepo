import { z } from "zod";

export const authUserSchema = z.object({
  userId: z.string(),
  isGuest: z.boolean(),
});

export const authResponseSchema = z.object({
  accessToken: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string().nullable(),
    avatar: z.string().nullable(),
    isGuest: z.boolean(),
  }),
});

export type AuthUser = z.infer<typeof authUserSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;