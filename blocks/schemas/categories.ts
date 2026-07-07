import { z } from "zod";
import { sectionBackgroundSchema, textColorSchema } from "../section-background";

export const categoryItemSchema = z.object({
  image: z.string().default(""), // URL del CDN de Bunny
  title: z.string().default(""),
  paragraph: z.string().default(""),
  buttonLabel: z.string().default(""),
  buttonHref: z.string().default(""),
});

export const categoriesDataSchema = z.object({
  heading: z.string().default(""),
  paragraph: z.string().default(""),
  items: z.array(categoryItemSchema).default([]),
});

export const categoriesSettingsSchema = z.object({
  columns: z.enum(["2", "3", "4"]).default("3"),
  background: sectionBackgroundSchema,
  textColor: textColorSchema,
});

export type CategoryItem = z.infer<typeof categoryItemSchema>;
export type CategoriesData = z.infer<typeof categoriesDataSchema>;
export type CategoriesSettings = z.infer<typeof categoriesSettingsSchema>;

export const categoriesDefault: {
  data: CategoriesData;
  settings: CategoriesSettings;
} = {
  data: categoriesDataSchema.parse({}),
  settings: categoriesSettingsSchema.parse({}),
};
