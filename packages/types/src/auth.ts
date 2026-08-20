import { z } from "zod";

export const authUserSchema = z.object({
  userId: z.string(),
  isGuest: z.boolean(),
});

export const userSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  username: z.string().nullable(),
  title: z.string().nullable(),
  email: z.string().nullable(),
  avatar: z.string().nullable(),
  isGuest: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const authResponseSchema = z.object({
  user: userSchema,
});

export const updateUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100).optional(),
  username: z.string().trim().min(1, "Username is required").max(50).optional(),
  title: z.string().trim().min(1, "Title is required").max(100).optional(),
  email: z.email("Enter a valid email").optional(),
  avatar: z.url("Enter a valid avatar URL").optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;
export type User = z.infer<typeof userSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
