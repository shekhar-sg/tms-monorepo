import { z } from "zod";
import { User } from "./auth";
import {
  type Priority,
  prioritySchema,
  type Status,
  statusSchema,
} from "./enums";

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).optional(),
  priority: prioritySchema.optional(),
  status: statusSchema.optional(),
  projectId: z.uuid(),
  assigneeId: z.uuid().optional(),
  parentId: z.uuid().optional(),
  dueDate: z.iso.datetime().optional(),
  position: z.number().optional(),
});

export const moveTaskSchema = z.object({
  status: statusSchema,
  beforeTaskId: z.uuid().nullable().optional(),
  afterTaskId: z.uuid().nullable().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();
export type MoveTaskInput = z.infer<typeof moveTaskSchema>;

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export type Task = {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  status: Status;
  projectId: string;
  assigneeId: string | null;
  parentId: string | null;
  dueDate: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
  assignee: User | null;
  subtasks: TaskSummary[];
};

export type TaskSummary = Omit<Task, "assignee" | "subtasks">;