import { z } from "zod";

export const authUserSchema = z.object({
  userId: z.string(),
  isGuest: z.boolean(),
});

export const userSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  avatar: z.string().nullable(),
  isGuest: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const authResponseSchema = z.object({
  user: userSchema,
});

export type AuthUser = z.infer<typeof authUserSchema>;
export type User = z.infer<typeof userSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
