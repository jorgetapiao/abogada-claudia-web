"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { PostModel } from "@/models/Post";
import { validateBlocks } from "@/lib/validate-blocks";
import { slugify } from "@/lib/slug";
import type { BlockInstance } from "@/blocks/types";

const metaSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  slug: z
    .string()
    .min(1, "El slug es obligatorio")
    .regex(/^[a-z0-9-]+$/, "El slug solo admite minúsculas, números y guiones"),
  status: z.enum(["draft", "published"]),
  excerpt: z.string().optional(),
});

type ActionResult = { ok: true } | { ok: false; error: string };

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const root = slugify(base) || "post";
  let candidate = root;
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await PostModel.findOne({ slug: candidate })
      .select("_id")
      .lean();
    if (!existing || String(existing._id) === excludeId) return candidate;
    n += 1;
    candidate = `${root}-${n}`;
  }
}

export async function createPost(formData: FormData): Promise<void> {
  await requireAdmin();
  await connectToDatabase();

  const title = String(formData.get("title") ?? "").trim() || "Nuevo post";
  const slug = await uniqueSlug(String(formData.get("slug") ?? title) || title);

  const doc = await PostModel.create({
    title,
    slug,
    status: "draft",
    content: [],
  });

  revalidatePath("/admin/blog");
  redirect(`/admin/blog/${doc._id}`);
}

export async function updatePost(
  id: string,
  payload: {
    title: string;
    slug: string;
    status: "draft" | "published";
    excerpt?: string;
    coverImage?: string;
    content: BlockInstance[];
  }
): Promise<ActionResult> {
  const session = await requireAdmin();
  await connectToDatabase();

  const meta = metaSchema.safeParse({
    title: payload.title,
    slug: payload.slug,
    status: payload.status,
    excerpt: payload.excerpt,
  });
  if (!meta.success) {
    return { ok: false, error: meta.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const slug = await uniqueSlug(meta.data.slug, id);
  const content = validateBlocks(payload.content);

  const existing = await PostModel.findById(id).select("author publishedAt").lean();

  await PostModel.updateOne(
    { _id: id },
    {
      $set: {
        title: meta.data.title,
        slug,
        status: meta.data.status,
        excerpt: meta.data.excerpt ?? "",
        coverImage: payload.coverImage ?? "",
        content,
        // Autor: se completa una sola vez, con quien guarda el post por primera vez.
        ...(!existing?.author ? { author: session.user.id } : {}),
        // Marca la fecha de publicación la primera vez que se publica.
        ...(meta.data.status === "published" && !existing?.publishedAt
          ? { publishedAt: new Date() }
          : {}),
      },
    }
  );

  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}`);
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  return { ok: true };
}

export async function deletePost(formData: FormData): Promise<void> {
  await requireAdmin();
  await connectToDatabase();

  const id = String(formData.get("id") ?? "");
  await PostModel.deleteOne({ _id: id });
  revalidatePath("/admin/blog");
}
