import type { BlockType } from "./types";
import { heroDefault } from "./schemas/hero";
import { imageDefault } from "./schemas/image";

/**
 * Catálogo CLIENT-SAFE de bloques: solo datos (tipo, etiqueta, valores por
 * defecto), sin componentes ni render. Lo usa el editor del panel para el menú
 * "Agregar bloque", ya que no puede importar `registry.tsx` (arrastra
 * componentes server / next/image).
 */
export interface BlockCatalogEntry {
  type: BlockType;
  label: string;
  description?: string;
  default: { data: unknown; settings: unknown };
}

export const blockCatalog: Partial<Record<BlockType, BlockCatalogEntry>> = {
  hero: {
    type: "hero",
    label: "Portada (Hero)",
    description: "Cabecera grande con título, subtítulo, imagen y botones.",
    default: heroDefault,
  },
  image: {
    type: "image",
    label: "Imagen",
    description: "Una imagen con epígrafe opcional.",
    default: imageDefault,
  },
  // TODO: agregar aquí cada bloque nuevo (mismo `default` que su schema).
};

export function availableCatalog(): BlockCatalogEntry[] {
  return Object.values(blockCatalog).filter(
    (e): e is BlockCatalogEntry => Boolean(e)
  );
}

export function getCatalogEntry(type: string): BlockCatalogEntry | undefined {
  return blockCatalog[type as BlockType];
}
