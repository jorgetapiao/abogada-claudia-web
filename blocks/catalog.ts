import type { BlockType } from "./types";
import { heroDefault } from "./schemas/hero";
import { imageDefault } from "./schemas/image";
import { testimonialsDefault } from "./schemas/testimonials";
import { categoriesDefault } from "./schemas/categories";
import { headingDefault } from "./schemas/heading";
import { paragraphDefault } from "./schemas/paragraph";

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
  testimonials: {
    type: "testimonials",
    label: "Reseñas",
    description: "Título, párrafo y opiniones de clientes.",
    default: testimonialsDefault,
  },
  categories: {
    type: "categories",
    label: "Categorías",
    description: "Título, párrafo y categorías con imagen, texto y botón.",
    default: categoriesDefault,
  },
  heading: {
    type: "heading",
    label: "Título",
    description: "Un título de sección o subtítulo dentro del contenido.",
    default: headingDefault,
  },
  paragraph: {
    type: "paragraph",
    label: "Párrafo",
    description: "Un bloque de texto simple.",
    default: paragraphDefault,
  },
  // TODO: agregar aquí cada bloque nuevo (mismo `default` que su schema).
};

/**
 * Lista de bloques para el menú "Agregar bloque". `allowedTypes` restringe el
 * catálogo (ej. el cuerpo de un post del blog no ofrece hero/categorías/etc.).
 */
export function availableCatalog(allowedTypes?: BlockType[]): BlockCatalogEntry[] {
  const entries = Object.values(blockCatalog).filter(
    (e): e is BlockCatalogEntry => Boolean(e)
  );
  if (!allowedTypes) return entries;
  return entries.filter((e) => allowedTypes.includes(e.type));
}

export function getCatalogEntry(type: string): BlockCatalogEntry | undefined {
  return blockCatalog[type as BlockType];
}
