import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "./db";
import { PageModel } from "@/models/Page";
import type { BlockInstance } from "@/blocks/types";

export interface PageSeo {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
}

/** Página lista para renderizar en el sitio público (objeto plano serializable). */
export interface PublicPage {
  _id: string;
  title: string;
  slug: string;
  blocks: BlockInstance[];
  seo?: PageSeo;
}

export interface NavPage {
  _id: string;
  title: string;
  slug: string;
}

/** Página editable en el panel (incluye borradores y metadatos). */
export interface EditablePage {
  _id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  blocks: BlockInstance[];
  seo?: PageSeo;
  isSystem?: boolean;
}

export interface PageListItem {
  _id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  isSystem?: boolean;
  updatedAt?: string;
}

/** Convierte un documento Mongoose (lean) en un objeto plano serializable. */
function plain<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}

// ---------- Público ----------

/** Devuelve una página publicada por slug, o null si no existe. */
export async function getPublishedPage(slug: string): Promise<PublicPage | null> {
  await connectToDatabase();
  const doc = await PageModel.findOne({ slug, status: "published" }).lean();
  return doc ? plain<PublicPage>(doc) : null;
}

/** Páginas publicadas que deben aparecer en el menú de navegación. */
export async function getNavPages(): Promise<NavPage[]> {
  await connectToDatabase();
  const docs = await PageModel.find({ status: "published", showInNav: true })
    .sort({ order: 1 })
    .select("title slug")
    .lean();
  return plain<NavPage[]>(docs);
}

// ---------- Panel ----------

/** Todas las páginas (incluye borradores) para la lista del panel. */
export async function getAllPages(): Promise<PageListItem[]> {
  await connectToDatabase();
  const docs = await PageModel.find()
    .sort({ order: 1, updatedAt: -1 })
    .select("title slug status isSystem updatedAt")
    .lean();
  return plain<PageListItem[]>(docs);
}

/** Una página por id para el editor, o null. */
export async function getPageById(id: string): Promise<EditablePage | null> {
  if (!isValidObjectId(id)) return null;
  await connectToDatabase();
  const doc = await PageModel.findById(id).lean();
  return doc ? plain<EditablePage>(doc) : null;
}
