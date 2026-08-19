import { z } from "zod";
import { accentColorSchema, themeSchema } from "./enums";

export const userPreferenceSchema = z.object({
  theme: themeSchema,
  accentColor: accentColorSchema,
});

export const updateUserPreferenceSchema = userPreferenceSchema.partial();

export type Theme = z.infer<typeof themeSchema>;
export type AccentColor = z.infer<typeof accentColorSchema>;
export type UserPreference = z.infer<typeof userPreferenceSchema>;
export type UpdateUserPreferenceInput = z.infer<
  typeof updateUserPreferenceSchema
>;
