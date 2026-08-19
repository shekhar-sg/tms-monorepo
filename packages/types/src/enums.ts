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

export const themeSchema = z.enum(["LIGHT", "DARK", "SYSTEM"]);

export const accentColorSchema = z.enum([
  "AMBER",
  "BLUE",
  "PINK",
  "ROSE",
  "EMERALD",
  "BLACK",
]);

export type Status = z.infer<typeof statusSchema>;
export type Priority = z.infer<typeof prioritySchema>;
