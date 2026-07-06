import { randomUUID } from "crypto";
import { connectToDatabase } from "./db";
import { MediaAssetModel } from "@/models/MediaAsset";

/**
 * Imágenes solamente en el MVP (video queda para la fase 2 con Bunny Stream,
 * ver memoria de proyecto). Mapea MIME → extensión de archivo permitida.
 */
export const ALLOWED_IMAGE_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB

/**
 * Genera una ruta de archivo única en el Storage, nunca derivada del nombre
 * original (evita colisiones y path traversal): `{año}/{mes}/{random}.{ext}`.
 */
export function generateBunnyPath(ext: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}/${month}/${randomUUID()}.${ext}`;
}

export interface MediaListItem {
  _id: string;
  filename: string;
  url: string;
  type: "image" | "video";
  mimeType?: string;
  sizeBytes?: number;
  createdAt?: string;
}

/** Todos los medios para la biblioteca del panel, más nuevos primero. */
export async function getAllMedia(): Promise<MediaListItem[]> {
  await connectToDatabase();
  const docs = await MediaAssetModel.find()
    .sort({ createdAt: -1 })
    .select("filename url type mimeType sizeBytes createdAt")
    .lean();
  return JSON.parse(JSON.stringify(docs));
}
