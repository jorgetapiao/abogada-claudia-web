import { heroDataSchema, heroSettingsSchema } from "./hero";

/**
 * Esquema del bloque `subHero`: mismos campos que `hero` (ver
 * schemas/hero.ts) — solo cambia el componente Render (usa `<h2>` en vez de
 * `<h1>`), para poder usarse en cualquier parte de la página, más de una vez.
 */
export const subHeroDataSchema = heroDataSchema;
export const subHeroSettingsSchema = heroSettingsSchema;

export type { HeroData as SubHeroData, HeroSettings as SubHeroSettings } from "./hero";

export const subHeroDefault = {
  data: heroDataSchema.parse({}),
  settings: heroSettingsSchema.parse({}),
};
