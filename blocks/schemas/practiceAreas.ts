import { z } from "zod";
import { sectionBackgroundSchema, textColorSchema } from "../section-background";

export const practiceAreaItemSchema = z.object({
  subtitle: z.string().default(""),
  paragraph: z.string().default(""),
  buttonLabel: z.string().default(""),
  buttonHref: z.string().default(""),
});

const tabSchema = z.object({
  label: z.string().default(""),
  items: z.array(practiceAreaItemSchema).default([]),
});

export const practiceAreasDataSchema = z.object({
  eyebrow: z.string().default(""),
  heading: z.string().default(""),
  paragraph: z.string().default(""),
  // Exactamente 2 pestañas (ej. "Personas" / "Empresas"), fijas: no se agregan
  // ni quitan pestañas, solo se editan sus textos y sus tarjetas.
  tabs: z
    .tuple([tabSchema, tabSchema])
    .default([
      { label: "", items: [] },
      { label: "", items: [] },
    ]),
});

export const practiceAreasSettingsSchema = z.object({
  columns: z.enum(["2", "3", "4"]).default("3"),
  background: sectionBackgroundSchema,
  textColor: textColorSchema,
});

export type PracticeAreaItem = z.infer<typeof practiceAreaItemSchema>;
export type PracticeAreasData = z.infer<typeof practiceAreasDataSchema>;
export type PracticeAreasSettings = z.infer<typeof practiceAreasSettingsSchema>;

export const practiceAreasDefault: {
  data: PracticeAreasData;
  settings: PracticeAreasSettings;
} = {
  data: practiceAreasDataSchema.parse({}),
  settings: practiceAreasSettingsSchema.parse({}),
};
