import { z } from "zod";

/**
 * Esquema del bloque `hero`. La validación de `data`/`settings` se usa:
 *  - en la Server Action antes de guardar (rechaza bloques malformados),
 *  - para generar los valores por defecto al crear el bloque.
 */
export const heroDataSchema = z.object({
  heading: z.string().default(""),
  subheading: z.string().default(""),
  backgroundImage: z.string().default(""), // URL del CDN de Bunny
  primaryCtaLabel: z.string().default(""),
  primaryCtaHref: z.string().default(""),
  secondaryCtaLabel: z.string().default(""),
  secondaryCtaHref: z.string().default(""),
});

export const heroSettingsSchema = z.object({
  variant: z
    .enum(["imageBackground", "sideBySide", "textOnly"])
    .default("imageBackground"),
  height: z.enum(["full", "medium"]).default("medium"),
});

export type HeroData = z.infer<typeof heroDataSchema>;
export type HeroSettings = z.infer<typeof heroSettingsSchema>;

export const heroDefault: { data: HeroData; settings: HeroSettings } = {
  data: heroDataSchema.parse({}),
  settings: heroSettingsSchema.parse({}),
};
