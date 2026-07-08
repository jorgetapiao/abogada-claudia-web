import { z } from "zod";
import { sectionBackgroundSchema, textColorSchema } from "../section-background";

export const contactFormDataSchema = z.object({
  heading: z.string().default(""),
  paragraph: z.string().default(""),
  // Opciones del select "Servicio de interés" que arma la abogada. El
  // programador agrega "Otro" automáticamente al final (ver render/ContactFormBlock.tsx).
  services: z.array(z.string()).default([]),
});

export const contactFormSettingsSchema = z.object({
  background: sectionBackgroundSchema,
  textColor: textColorSchema,
});

export type ContactFormData = z.infer<typeof contactFormDataSchema>;
export type ContactFormSettings = z.infer<typeof contactFormSettingsSchema>;

export const contactFormDefault: {
  data: ContactFormData;
  settings: ContactFormSettings;
} = {
  data: contactFormDataSchema.parse({}),
  settings: contactFormSettingsSchema.parse({}),
};
