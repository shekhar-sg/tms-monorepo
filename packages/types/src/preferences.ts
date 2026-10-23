import { z } from "zod";
import { accentColorSchema, themeSchema } from "./enums";

export const taskViewSchema = z.object({
  view: z.enum(["board", "list"]),
  sort: z.enum(["manual", "priority", "dueDate", "created", "title"]),
  fields: z.array(z.enum(["priority", "members", "dueDate", "actions"])).max(4),
  columns: z
    .array(z.enum(["BACKLOG", "TODO", "IN_PROGRESS", "REVIEW", "DONE"]))
    .length(5)
    .refine((v) => new Set(v).size === 5),
});
export type TaskViewPreference = z.infer<typeof taskViewSchema>;

export const userPreferenceSchema = z.object({
  theme: themeSchema,
  accentColor: accentColorSchema,
  taskViews: z.record(z.string().max(100), taskViewSchema).default({}),
});

export const updateUserPreferenceSchema = userPreferenceSchema.partial();

export type Theme = z.infer<typeof themeSchema>;
export type AccentColor = z.infer<typeof accentColorSchema>;
export type UserPreference = z.infer<typeof userPreferenceSchema>;
export type UpdateUserPreferenceInput = z.infer<
  typeof updateUserPreferenceSchema
>;
