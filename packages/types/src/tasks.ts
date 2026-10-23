import { z } from "zod";
import { User } from "./auth";
import {
  type Priority,
  prioritySchema,
  type Status,
  statusSchema,
} from "./enums";

const taskRelationsSchema = {
  title: z
    .string()
    .trim()
    .min(1, { error: "Task title is required" })
    .max(200, { error: "Task title must be 200 characters or less" }),
  description: z.string().trim().max(5000).nullable().optional(),
  resource: z.string().trim().max(2000).nullable().optional(),
  priority: prioritySchema.optional(),
  status: statusSchema.optional(),
  projectId: z.uuid({ error: "Please select a project" }),
  reporterId: z.uuid({ error: "Please select a reporter" }),
  members: z.array(z.uuid()).default([]),
  parentId: z.uuid().nullable().optional(),
  startDate: z.iso.datetime().nullable().optional(),
  endDate: z.iso.datetime().nullable().optional(),
  labels: z.array(z.uuid()).default([]),
};

export const createTaskSchema = z.object(taskRelationsSchema);
export const updateTaskSchema = z
  .object({
    ...taskRelationsSchema,
    reporterId: z.uuid().nullable().optional(),
    members: z.array(z.uuid()).optional(),
    labels: z.array(z.uuid()).optional(),
  })
  .partial();

export const moveTaskSchema = z.object({
  revision: z.number().int().nonnegative().optional(),
  status: statusSchema,
  beforeTaskId: z.uuid().nullable().optional(),
  afterTaskId: z.uuid().nullable().optional(),
});

const csvArray = z.string().transform((value) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
);

export const getTasksQuerySchema = z
  .object({
    search: z.string().trim(),
    status: csvArray.pipe(z.array(statusSchema)),
    priority: csvArray.pipe(z.array(prioritySchema)),
    labels: csvArray.pipe(z.array(z.uuid())),
    dueDateFrom: z.iso.datetime(),
    dueDateTo: z.iso.datetime(),
  })
  .partial();

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type MoveTaskInput = z.infer<typeof moveTaskSchema>;
export type GetTasksQuery = z.infer<typeof getTasksQuerySchema>;

export type TaskActor = Pick<User, "id" | "name" | "avatar">;
export type Task = {
  id: string;
  title: string;
  description: string | null;
  resource: string | null;
  priority: Priority;
  status: Status;
  projectId: string;
  reporterId: string | null;
  reporter: TaskActor | null;
  members: TaskMember[];
  parentId: string | null;
  startDate: string | null;
  endDate: string | null;
  labels: TaskLabel[];
  position: number;
  revision: number;
  project?: { id: string; title: string };
  createdAt: string;
  updatedAt: string;
  subtasks: SubtaskSummary[];
};

export type TaskMember = {
  userId: string;
  user: TaskActor;
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

export type SubtaskSummary = Omit<Task, "reporter" | "labels" | "subtasks"> & {
  subtasks?: never;
};
