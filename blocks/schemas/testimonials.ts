import { z } from "zod";
import { sectionBackgroundSchema, textColorSchema } from "../section-background";

export const testimonialItemSchema = z.object({
  quote: z.string().default(""),
  authorName: z.string().default(""),
});

export const testimonialsDataSchema = z.object({
  heading: z.string().default(""),
  paragraph: z.string().default(""),
  items: z.array(testimonialItemSchema).default([]),
});

export const testimonialsSettingsSchema = z.object({
  columns: z.enum(["2", "3"]).default("3"),
  align: z.enum(["left", "center"]).default("center"),
  background: sectionBackgroundSchema,
  textColor: textColorSchema,
});

export type TestimonialItem = z.infer<typeof testimonialItemSchema>;
export type TestimonialsData = z.infer<typeof testimonialsDataSchema>;
export type TestimonialsSettings = z.infer<typeof testimonialsSettingsSchema>;

export const testimonialsDefault: {
  data: TestimonialsData;
  settings: TestimonialsSettings;
} = {
  data: testimonialsDataSchema.parse({}),
  settings: testimonialsSettingsSchema.parse({}),
};
