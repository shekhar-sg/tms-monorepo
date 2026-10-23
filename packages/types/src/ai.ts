import { z } from "zod";
import { prioritySchema, statusSchema } from "./enums";

const item = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().max(5000).nullable(),
  priority: prioritySchema,
  status: statusSchema,
  endDate: z.iso.datetime().nullable(),
});
export const aiTaskSchema = item.extend({ subtasks: z.array(item).max(10) });
export const aiProposalSchema = z
  .object({
    projectTitle: z.string().trim().min(1).max(200).nullable(),
    projectId: z.uuid().nullable(),
    parentId: z.uuid().nullable(),
    tasks: z.array(aiTaskSchema).max(15),
  })
  .refine(
    (p) => p.tasks.reduce((n, t) => n + 1 + t.subtasks.length, 0) <= 30,
    "Create at most 30 tasks at a time"
  );
export const aiAssistSchema = z.object({
  prompt: z.string().trim().min(1).max(3000),
  projectId: z.uuid().optional(),
  taskId: z.uuid().optional(),
  draft: aiProposalSchema.nullable().optional(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(3000),
      })
    )
    .max(4)
    .default([]),
  timeZone: z.string().max(100).default("Asia/Kolkata"),
});
export const aiAnswerSchema = z.object({
  kind: z.enum(["answer", "clarification", "proposal"]),
  message: z.string().max(6000),
  proposal: aiProposalSchema.nullable(),
  references: z
    .array(
      z.object({
        id: z.uuid(),
        title: z.string().max(200),
        type: z.enum(["task", "project"]),
      })
    )
    .max(10),
});
export const aiApplySchema = z.object({
  key: z.uuid(),
  proposal: aiProposalSchema,
});
export type AiAssistInput = z.infer<typeof aiAssistSchema>;
export type AiProposal = z.infer<typeof aiProposalSchema>;
export type AiAnswer = z.infer<typeof aiAnswerSchema>;
export type AiApplyInput = z.infer<typeof aiApplySchema>;
