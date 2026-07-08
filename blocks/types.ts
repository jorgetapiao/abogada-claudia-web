import type { ComponentType } from "react";
import type { ZodType } from "zod";

/**
 * Tipos base del sistema de bloques.
 *
 * Un bloque = { type, data, settings }:
 * - `data`     → contenido editable por la abogada (textos, URLs).
 * - `settings` → variantes de estilo ACOTADAS definidas por el programador.
 *
 * El diseño vive en el código (globals.css + componentes Render), nunca en `data`.
 */

/** Catálogo MVP de tipos de bloque. */
export type BlockType =
  | "hero"
  | "subHero"
  | "richText"
  | "image"
  | "servicesGrid"
  | "textImage"
  | "cta"
  | "faq"
  | "testimonials"
  | "contactForm"
  | "statsCounter"
  | "categories"
  | "heading"
  | "paragraph"
  | "featuredPosts"
  | "practiceAreas";

/** Un bloque tal como se guarda/lee (embebido en Page.blocks o Post.content). */
export interface BlockInstance<
  D = Record<string, unknown>,
  S = Record<string, unknown>,
> {
  _id?: string;
  type: string;
  data: D;
  settings: S;
}

/** Props que recibe el componente PÚBLICO de un bloque. */
export interface BlockRenderProps<D, S> {
  data: D;
  settings: S;
}

/** Props que recibe el formulario del PANEL de un bloque. */
export interface BlockEditorProps<D, S> {
  data: D;
  settings: S;
  onChange: (next: { data: D; settings: S }) => void;
}

/**
 * Definición de un bloque en el registry de render.
 * Reúne todo lo que el sistema necesita para un tipo: etiqueta para el panel,
 * validación (Zod), valores por defecto y el componente público.
 */
export interface BlockDefinition<D = unknown, S = unknown> {
  type: BlockType;
  /** Etiqueta que ve la abogada en "Agregar bloque". */
  label: string;
  description?: string;
  dataSchema: ZodType<D>;
  settingsSchema: ZodType<S>;
  /** Valores iniciales al crear el bloque. */
  default: { data: D; settings: S };
  /** Componente público (server component). */
  Render: ComponentType<BlockRenderProps<D, S>>;
}
