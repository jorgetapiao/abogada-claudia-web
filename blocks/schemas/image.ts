import { z } from "zod";
import { sectionBackgroundSchema } from "../section-background";

export const imageDataSchema = z.object({
  image: z.string().default(""), // URL del CDN de Bunny
  alt: z.string().default(""),
  caption: z.string().default(""),
});

export const imageSettingsSchema = z.object({
  size: z.enum(["full", "contained"]).default("full"),
  rounded: z.boolean().default(false),
  background: sectionBackgroundSchema,
});

export type ImageData = z.infer<typeof imageDataSchema>;
export type ImageSettings = z.infer<typeof imageSettingsSchema>;

export const imageDefault: { data: ImageData; settings: ImageSettings } = {
  data: imageDataSchema.parse({}),
  settings: imageSettingsSchema.parse({}),
};
