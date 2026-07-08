import { z } from "zod";
import { sectionBackgroundSchema, textColorSchema } from "../section-background";

export const featuredPostsDataSchema = z.object({
  heading: z.string().default(""),
  paragraph: z.string().default(""),
  // Ids de posts elegidos a mano por la abogada, en el orden en que los eligió.
  postIds: z.array(z.string()).default([]),
  buttonLabel: z.string().default("Ver todas las publicaciones"),
});

export const featuredPostsSettingsSchema = z.object({
  columns: z.enum(["2", "3"]).default("3"),
  background: sectionBackgroundSchema,
  textColor: textColorSchema,
});

export type FeaturedPostsData = z.infer<typeof featuredPostsDataSchema>;
export type FeaturedPostsSettings = z.infer<typeof featuredPostsSettingsSchema>;

export const featuredPostsDefault: {
  data: FeaturedPostsData;
  settings: FeaturedPostsSettings;
} = {
  data: featuredPostsDataSchema.parse({}),
  settings: featuredPostsSettingsSchema.parse({}),
};
