import { z } from "zod";

export const headingDataSchema = z.object({
  text: z.string().default(""),
  level: z.enum(["h2", "h3"]).default("h2"),
});

export const headingSettingsSchema = z.object({});

export type HeadingData = z.infer<typeof headingDataSchema>;
export type HeadingSettings = z.infer<typeof headingSettingsSchema>;

export const headingDefault: { data: HeadingData; settings: HeadingSettings } = {
  data: headingDataSchema.parse({}),
  settings: headingSettingsSchema.parse({}),
};
