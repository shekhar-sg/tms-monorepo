import { z } from "zod";
import { User } from "./auth";
import {
  type Priority,
  prioritySchema,
  type Status,
  statusSchema,
} from "./enums";

const taskRelationsSchema = {
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).nullable().optional(),
  resource: z.string().trim().max(2000).nullable().optional(),
  priority: prioritySchema.optional(),
  status: statusSchema.optional(),
  projectId: z.uuid().optional(),
  reporterId: z.uuid().nullable().optional(),
  members: z.array(z.uuid()).default([]),
  parentId: z.uuid().nullable().optional(),
  startDate: z.iso.datetime().nullable().optional(),
  endDate: z.iso.datetime().nullable().optional(),
  labels: z.array(z.uuid()).default([]),
  position: z.number().optional(),
};

export const createTaskSchema = z.object({
  ...taskRelationsSchema,
  projectId: z.uuid(),
});

export const updateTaskSchema = z.object(taskRelationsSchema);

export const moveTaskSchema = z.object({
  status: statusSchema,
  beforeTaskId: z.uuid().nullable().optional(),
  afterTaskId: z.uuid().nullable().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type MoveTaskInput = z.infer<typeof moveTaskSchema>;

export type Task = {
  id: string;
  title: string;
  description: string | null;
  resource: string | null;
  priority: Priority;
  status: Status;
  projectId: string;
  reporterId: string | null;
  reporter: User | null;
  members: TaskMember[];
  parentId: string | null;
  startDate: string | null;
  endDate: string | null;
  labels: TaskLabel[];
  position: number;
  createdAt: string;
  updatedAt: string;
  subtasks: TaskSummary[];
};

export type TaskMember = {
  userId: string;
  user: User;
};

export type Label = {
  id: string;
  name: string;
  color: string | null;
};

export type TaskLabel = {
  labelId: string;
  label: Label;
};

export type TaskSummary = Omit<
  Task,
  "reporter" | "members" | "labels" | "subtasks"
> & {
  subtasks?: never;
};
