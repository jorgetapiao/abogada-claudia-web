import type { BlockDefinition, BlockType } from "./types";
import { HeroBlock } from "./render/HeroBlock";
import { heroDataSchema, heroSettingsSchema, heroDefault } from "./schemas/hero";
import { ImageBlock } from "./render/ImageBlock";
import { imageDataSchema, imageSettingsSchema, imageDefault } from "./schemas/image";

/**
 * Registry de RENDER (server). Mapea cada tipo de bloque a su definición:
 * etiqueta para el panel, validación, valores por defecto y componente público.
 *
 * Es `Partial` porque en el MVP solo `hero` está implementado. Para agregar un
 * bloque nuevo (patrón a seguir con los otros 9 del catálogo):
 *   1. crear blocks/schemas/<tipo>.ts (Zod data/settings + default)
 *   2. crear blocks/render/<Tipo>Block.tsx (componente público)
 *   3. crear blocks/editors/<Tipo>Editor.tsx (formulario del panel)
 *   4. registrar acá y en blocks/editors/registry.ts
 *
 * TODO (fase MVP restante): richText, image, servicesGrid, textImage, cta,
 * faq, testimonials, contactForm, statsCounter.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyBlockDefinition = BlockDefinition<any, any>;

export const blockRegistry: Partial<Record<BlockType, AnyBlockDefinition>> = {
  hero: {
    type: "hero",
    label: "Portada (Hero)",
    description: "Cabecera grande con título, subtítulo, imagen y botones.",
    dataSchema: heroDataSchema,
    settingsSchema: heroSettingsSchema,
    default: heroDefault,
    Render: HeroBlock as AnyBlockDefinition["Render"],
  },
  image: {
    type: "image",
    label: "Imagen",
    description: "Una imagen con epígrafe opcional.",
    dataSchema: imageDataSchema,
    settingsSchema: imageSettingsSchema,
    default: imageDefault,
    Render: ImageBlock as AnyBlockDefinition["Render"],
  },
};

export function getBlockDefinition(type: string): AnyBlockDefinition | undefined {
  return blockRegistry[type as BlockType];
}

/** Lista de bloques disponibles para el menú "Agregar bloque" del panel. */
export function availableBlocks(): { type: BlockType; label: string; description?: string }[] {
  return Object.values(blockRegistry)
    .filter((d): d is AnyBlockDefinition => Boolean(d))
    .map((d) => ({ type: d.type, label: d.label, description: d.description }));
}
