import { randomUUID } from "crypto";
import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "./db";
import { PageModel } from "@/models/Page";
import type { BlockInstance } from "@/blocks/types";

/** Slug reservado de la página de inicio: coincide con la raíz del sitio. */
export const HOME_SLUG = "/";

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

/**
 * Páginas publicadas que deben aparecer en el menú de navegación dinámico.
 * Excluye la home (slug "/"): el Header ya tiene su propio link fijo a "/".
 */
export async function getNavPages(): Promise<NavPage[]> {
  await connectToDatabase();
  const docs = await PageModel.find({
    status: "published",
    showInNav: true,
    slug: { $ne: HOME_SLUG },
  })
    .sort({ order: 1 })
    .select("title slug")
    .lean();
  return plain<NavPage[]>(docs);
}

// ---------- Panel ----------

/**
 * Garantiza que exista la página de sistema "Inicio" con slug "/" — la que
 * lee `app/(site)/page.tsx` para la raíz del sitio. `isSystem: true` evita
 * que se pueda borrar o que se le cambie el slug (ver `updatePage`).
 *
 * Migra instalaciones previas que hayan quedado con el slug antiguo "home".
 */
async function ensureHomePage(): Promise<void> {
  const existing = await PageModel.findOne({
    $or: [{ slug: HOME_SLUG }, { slug: "home", isSystem: true }],
  }).select("_id slug");

  if (existing) {
    if (existing.slug !== HOME_SLUG) {
      await PageModel.updateOne({ _id: existing._id }, { $set: { slug: HOME_SLUG } });
    }
    return;
  }

  await PageModel.create({
    title: "Inicio",
    slug: HOME_SLUG,
    status: "published",
    isSystem: true,
    showInNav: true,
    order: 0,
    blocks: [
      {
        _id: randomUUID(),
        type: "hero",
        data: {
          heading: "Asesoría legal en la que puede confiar",
          subheading: "Editá este texto desde el panel para contarle a tus clientes qué hacés.",
          backgroundImage: "",
          primaryCtaLabel: "Contacto",
          primaryCtaHref: "/contacto",
          secondaryCtaLabel: "",
          secondaryCtaHref: "",
        },
        settings: { variant: "textOnly", height: "medium" },
      },
    ],
  });
}

/** Todas las páginas (incluye borradores) para la lista del panel. */
export async function getAllPages(): Promise<PageListItem[]> {
  await connectToDatabase();
  await ensureHomePage();
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
