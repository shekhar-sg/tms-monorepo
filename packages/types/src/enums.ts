import { z } from "zod";

export const statusSchema = z.enum([
  "BACKLOG",
  "TODO",
  "IN_PROGRESS",
  "REVIEW",
  "DONE",
]);

export const prioritySchema = z.enum([
  "NONE",
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
]);

export type Status = z.infer<typeof statusSchema>;
export type Priority = z.infer<typeof prioritySchema>;
