import { z } from "zod";
import { type Priority, prioritySchema } from "./enums";

export const createProjectSchema = z.object({
  title: z.string().trim().min(1).max(200),
  priority: prioritySchema.optional(),
  dueDate: z.iso.datetime().nullable().optional(),
});

export const updateProjectSchema = createProjectSchema
  .extend({
    leadId: z.uuid().nullable().optional(),
  })
  .partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

export interface Project {
  id: string;
  title: string;
  priority: Priority | null;
  leadId: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  lead: {
    id: string;
    name: string | null;
    avatar: string | null;
  };
}
