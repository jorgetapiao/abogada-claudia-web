"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { deleteFromBunny } from "@/lib/bunny";
import { getAllMedia, type MediaListItem } from "@/lib/media";
import { MediaAssetModel } from "@/models/MediaAsset";

/** Lista los medios disponibles para el selector de los editores de bloque. */
export async function listMedia(): Promise<MediaListItem[]> {
  await requireAdmin();
  return getAllMedia();
}

/**
 * Borra un medio: primero el archivo en Bunny.net, luego el registro en Mongo.
 * Borrado simple (MVP): no se verifica si el asset está en uso en algún bloque.
 */
export async function deleteMedia(formData: FormData): Promise<void> {
  await requireAdmin();
  await connectToDatabase();

  const id = String(formData.get("id") ?? "");
  const asset = await MediaAssetModel.findById(id).select("bunnyPath").lean();
  if (!asset) return;

  await deleteFromBunny(asset.bunnyPath);
  await MediaAssetModel.deleteOne({ _id: id });

  revalidatePath("/admin/media");
}
