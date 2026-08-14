import { z } from "zod";

export const prioritySchema = z.enum([
  "NONE",
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
]);

export const createProjectSchema = z.object({
  title: z.string().trim().min(1).max(200),
  priority: prioritySchema.optional(),
  leadId: z.uuid().optional(),
  dueDate: z.iso.datetime().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type Priority = z.infer<typeof prioritySchema>;
