import type { BlockRenderProps } from "../types";
import type { HeroData, HeroSettings } from "../schemas/hero";
import { HeroBlockBase } from "./HeroBlock";

/**
 * Componente PÚBLICO del bloque `subHero` (server component): igual que
 * `hero` (mismos campos y variantes), pero con `<h2>` en vez de `<h1>` — así
 * se puede usar en cualquier parte de la página, más de una vez, sin repetir
 * el único `<h1>` que debe llevar el hero principal.
 */
export function SubHeroBlock(props: BlockRenderProps<HeroData, HeroSettings>) {
  return <HeroBlockBase {...props} headingTag="h2" />;
}
