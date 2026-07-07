import { z } from "zod";

export const paragraphDataSchema = z.object({
  text: z.string().default(""),
});

export const paragraphSettingsSchema = z.object({});

export type ParagraphData = z.infer<typeof paragraphDataSchema>;
export type ParagraphSettings = z.infer<typeof paragraphSettingsSchema>;

export const paragraphDefault: { data: ParagraphData; settings: ParagraphSettings } = {
  data: paragraphDataSchema.parse({}),
  settings: paragraphSettingsSchema.parse({}),
};
