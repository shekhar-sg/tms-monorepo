import { z } from "zod";

export const createCommentSchema = z.object({
  content: z.string().trim().min(1).max(5000),
  parentId: z.uuid().nullable().optional(),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

export type Comment = {
  id: string;
  content: string;
  taskId: string;
  authorId: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string | null;
    avatar: string | null;
  };
};
