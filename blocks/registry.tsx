import type { BlockDefinition, BlockType } from "./types";
import { HeroBlock } from "./render/HeroBlock";
import { heroDataSchema, heroSettingsSchema, heroDefault } from "./schemas/hero";
import { SubHeroBlock } from "./render/SubHeroBlock";
import { subHeroDataSchema, subHeroSettingsSchema, subHeroDefault } from "./schemas/subHero";
import { ImageBlock } from "./render/ImageBlock";
import { imageDataSchema, imageSettingsSchema, imageDefault } from "./schemas/image";
import { TestimonialsBlock } from "./render/TestimonialsBlock";
import {
  testimonialsDataSchema,
  testimonialsSettingsSchema,
  testimonialsDefault,
} from "./schemas/testimonials";
import { CategoriesBlock } from "./render/CategoriesBlock";
import {
  categoriesDataSchema,
  categoriesSettingsSchema,
  categoriesDefault,
} from "./schemas/categories";
import { HeadingBlock } from "./render/HeadingBlock";
import { headingDataSchema, headingSettingsSchema, headingDefault } from "./schemas/heading";
import { ParagraphBlock } from "./render/ParagraphBlock";
import { paragraphDataSchema, paragraphSettingsSchema, paragraphDefault } from "./schemas/paragraph";
import { FeaturedPostsBlock } from "./render/FeaturedPostsBlock";
import {
  featuredPostsDataSchema,
  featuredPostsSettingsSchema,
  featuredPostsDefault,
} from "./schemas/featuredPosts";
import { ContactFormBlock } from "./render/ContactFormBlock";
import {
  contactFormDataSchema,
  contactFormSettingsSchema,
  contactFormDefault,
} from "./schemas/contactForm";
import { PracticeAreasBlock } from "./render/PracticeAreasBlock";
import {
  practiceAreasDataSchema,
  practiceAreasSettingsSchema,
  practiceAreasDefault,
} from "./schemas/practiceAreas";

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
  subHero: {
    type: "subHero",
    label: "Sección destacada",
    description:
      "Título grande, texto y botones para destacar cualquier parte de la página. Se puede agregar donde quieras y las veces que quieras.",
    dataSchema: subHeroDataSchema,
    settingsSchema: subHeroSettingsSchema,
    default: subHeroDefault,
    Render: SubHeroBlock as AnyBlockDefinition["Render"],
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
  testimonials: {
    type: "testimonials",
    label: "Reseñas",
    description: "Título, párrafo y opiniones de clientes.",
    dataSchema: testimonialsDataSchema,
    settingsSchema: testimonialsSettingsSchema,
    default: testimonialsDefault,
    Render: TestimonialsBlock as AnyBlockDefinition["Render"],
  },
  categories: {
    type: "categories",
    label: "Categorías",
    description: "Título, párrafo y categorías con imagen, texto y botón.",
    dataSchema: categoriesDataSchema,
    settingsSchema: categoriesSettingsSchema,
    default: categoriesDefault,
    Render: CategoriesBlock as AnyBlockDefinition["Render"],
  },
  heading: {
    type: "heading",
    label: "Título",
    description: "Un título de sección o subtítulo dentro del contenido.",
    dataSchema: headingDataSchema,
    settingsSchema: headingSettingsSchema,
    default: headingDefault,
    Render: HeadingBlock as AnyBlockDefinition["Render"],
  },
  paragraph: {
    type: "paragraph",
    label: "Párrafo",
    description: "Un bloque de texto simple.",
    dataSchema: paragraphDataSchema,
    settingsSchema: paragraphSettingsSchema,
    default: paragraphDefault,
    Render: ParagraphBlock as AnyBlockDefinition["Render"],
  },
  featuredPosts: {
    type: "featuredPosts",
    label: "Publicaciones del blog",
    description:
      "Título, texto y las publicaciones del blog que elijas, con un botón al blog completo.",
    dataSchema: featuredPostsDataSchema,
    settingsSchema: featuredPostsSettingsSchema,
    default: featuredPostsDefault,
    Render: FeaturedPostsBlock as AnyBlockDefinition["Render"],
  },
  contactForm: {
    type: "contactForm",
    label: "Formulario de contacto",
    description:
      "Título, texto, datos de contacto y un formulario para que te escriban.",
    dataSchema: contactFormDataSchema,
    settingsSchema: contactFormSettingsSchema,
    default: contactFormDefault,
    Render: ContactFormBlock as AnyBlockDefinition["Render"],
  },
  practiceAreas: {
    type: "practiceAreas",
    label: "Contenido con pestañas",
    description:
      "Texto pequeño, título, párrafo y dos botones que alternan entre dos grupos de tarjetas. Sirve para áreas de práctica u otro contenido que quieras separar en dos categorías.",
    dataSchema: practiceAreasDataSchema,
    settingsSchema: practiceAreasSettingsSchema,
    default: practiceAreasDefault,
    Render: PracticeAreasBlock as AnyBlockDefinition["Render"],
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
