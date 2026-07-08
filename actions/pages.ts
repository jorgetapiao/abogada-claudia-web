"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { PageModel } from "@/models/Page";
import { validateBlocks } from "@/lib/validate-blocks";
import { slugify } from "@/lib/slug";
import { HOME_SLUG } from "@/lib/pages";
import type { BlockInstance } from "@/blocks/types";

const metaSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  // La home usa el slug reservado "/" (ver HOME_SLUG); el resto, minúsculas/números/guiones.
  slug: z
    .string()
    .min(1, "El slug es obligatorio")
    .regex(/^(\/|[a-z0-9-]+)$/, "El slug solo admite minúsculas, números y guiones"),
  status: z.enum(["draft", "published"]),
});

type ActionResult = { ok: true } | { ok: false; error: string };

/** Genera un slug único (agrega sufijo -2, -3… si ya existe). */
async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const root = slugify(base) || "pagina";
  let candidate = root;
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await PageModel.findOne({ slug: candidate })
      .select("_id")
      .lean();
    if (!existing || String(existing._id) === excludeId) return candidate;
    n += 1;
    candidate = `${root}-${n}`;
  }
}

/** Crea una página vacía y redirige a su editor. */
export async function createPage(formData: FormData): Promise<void> {
  await requireAdmin();
  await connectToDatabase();

  const title = String(formData.get("title") ?? "").trim() || "Nueva página";
  const slug = await uniqueSlug(String(formData.get("slug") ?? title) || title);

  // Las páginas nuevas se agregan al final del orden (la home, order 0,
  // siempre queda primera y no compite por esta numeración).
  const last = await PageModel.findOne({ isSystem: { $ne: true } })
    .sort({ order: -1 })
    .select("order")
    .lean();
  const order = (last?.order ?? 0) + 1;

  const doc = await PageModel.create({ title, slug, status: "draft", blocks: [], order });

  revalidatePath("/admin/pages");
  redirect(`/admin/pages/${doc._id}`);
}

/** Guarda los cambios de una página (metadatos + bloques). */
export async function updatePage(
  id: string,
  payload: {
    title: string;
    slug: string;
    status: "draft" | "published";
    blocks: BlockInstance[];
    seo?: { metaTitle?: string; metaDescription?: string; ogImage?: string };
  }
): Promise<ActionResult> {
  await requireAdmin();
  await connectToDatabase();

  const current = await PageModel.findById(id).select("isSystem slug").lean();
  if (!current) {
    return { ok: false, error: "Página no encontrada" };
  }

  // La home (isSystem) nunca cambia de slug: siempre "/" (HOME_SLUG), pase lo
  // que pase en el formulario. El resto de páginas usa el slug enviado.
  const meta = metaSchema.safeParse({
    title: payload.title,
    slug: current.isSystem ? HOME_SLUG : payload.slug,
    status: payload.status,
  });
  if (!meta.success) {
    return { ok: false, error: meta.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const slug = current.isSystem ? HOME_SLUG : await uniqueSlug(meta.data.slug, id);
  const blocks = validateBlocks(payload.blocks);

  await PageModel.updateOne(
    { _id: id },
    {
      $set: {
        title: meta.data.title,
        slug,
        status: meta.data.status,
        blocks,
        seo: payload.seo ?? {},
      },
    }
  );

  revalidatePath("/admin/pages");
  revalidatePath(`/admin/pages/${id}`);
  revalidatePath("/");
  if (slug !== HOME_SLUG) revalidatePath(`/${slug}`);
  return { ok: true };
}

/** Elimina una página (salvo las de sistema). */
export async function deletePage(formData: FormData): Promise<void> {
  await requireAdmin();
  await connectToDatabase();

  const id = String(formData.get("id") ?? "");
  const page = await PageModel.findById(id).select("isSystem").lean();
  if (!page || page.isSystem) return; // no se borran páginas de sistema

  await PageModel.deleteOne({ _id: id });
  revalidatePath("/admin/pages");
}

/**
 * Mueve una página un lugar hacia arriba/abajo en el orden del menú. La home
 * (isSystem) queda excluida: siempre es la primera. Antes de intercambiar,
 * renumera 1..n todas las páginas no-sistema según el orden actual, así se
 * autocorrige si había empates (páginas creadas antes de tener este control,
 * todas con `order: 0`).
 */
export async function reorderPage(formData: FormData): Promise<void> {
  await requireAdmin();
  await connectToDatabase();

  const id = String(formData.get("id") ?? "");
  const direction = String(formData.get("direction") ?? "");
  if (direction !== "up" && direction !== "down") return;

  const docs = await PageModel.find({ isSystem: { $ne: true } })
    .sort({ order: 1, updatedAt: -1 })
    .select("_id")
    .lean();

  const index = docs.findIndex((d) => String(d._id) === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= docs.length) return;

  const ids = docs.map((d) => String(d._id));
  [ids[index], ids[swapWith]] = [ids[swapWith], ids[index]];

  await Promise.all(
    ids.map((docId, i) => PageModel.updateOne({ _id: docId }, { $set: { order: i + 1 } }))
  );

  revalidatePath("/admin/pages");
  revalidatePath("/");
}
