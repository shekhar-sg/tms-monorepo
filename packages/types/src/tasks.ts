import { z } from "zod";

import { prioritySchema } from "./project";

export const taskStatusSchema = z.enum([
  "BACKLOG",
  "TODO",
  "IN_PROGRESS",
  "REVIEW",
  "DONE",
]);

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).optional(),
  priority: prioritySchema.optional(),
  status: taskStatusSchema.optional(),
  projectId: z.uuid(),
  assigneeId: z.uuid().optional(),
  parentId: z.uuid().optional(),
  dueDate: z.iso.datetime().optional(),
  position: z.number().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export type TaskStatus = z.infer<typeof taskStatusSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
