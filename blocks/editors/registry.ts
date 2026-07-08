import type { ComponentType } from "react";
import type { BlockEditorProps, BlockType } from "../types";
import { HeroEditor } from "./HeroEditor";
import { ImageEditor } from "./ImageEditor";
import { TestimonialsEditor } from "./TestimonialsEditor";
import { CategoriesEditor } from "./CategoriesEditor";
import { HeadingEditor } from "./HeadingEditor";
import { ParagraphEditor } from "./ParagraphEditor";
import { FeaturedPostsEditor } from "./FeaturedPostsEditor";
import { ContactFormEditor } from "./ContactFormEditor";
import { PracticeAreasEditor } from "./PracticeAreasEditor";

/**
 * Registry de EDITORES (client). Se importa solo desde el panel /admin, de modo
 * que el código de los formularios NO entra en el bundle del sitio público.
 *
 * `Partial` porque en el MVP solo `hero` está implementado. Registrá acá cada
 * bloque nuevo junto con su entrada en blocks/registry.tsx.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyEditor = ComponentType<BlockEditorProps<any, any>>;

export const editorRegistry: Partial<Record<BlockType, AnyEditor>> = {
  hero: HeroEditor as AnyEditor,
  // subHero reusa el mismo formulario: son los mismos campos que hero.
  subHero: HeroEditor as AnyEditor,
  image: ImageEditor as AnyEditor,
  testimonials: TestimonialsEditor as AnyEditor,
  categories: CategoriesEditor as AnyEditor,
  heading: HeadingEditor as AnyEditor,
  paragraph: ParagraphEditor as AnyEditor,
  featuredPosts: FeaturedPostsEditor as AnyEditor,
  contactForm: ContactFormEditor as AnyEditor,
  practiceAreas: PracticeAreasEditor as AnyEditor,
};

export function getBlockEditor(type: string): AnyEditor | undefined {
  return editorRegistry[type as BlockType];
}
