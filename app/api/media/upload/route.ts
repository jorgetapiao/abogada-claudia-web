import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/require-admin";
import { connectToDatabase } from "@/lib/db";
import { uploadToBunny, buildCdnUrl } from "@/lib/bunny";
import { ALLOWED_IMAGE_MIME_TYPES, MAX_IMAGE_BYTES, generateBunnyPath } from "@/lib/media";
import { MediaAssetModel } from "@/models/MediaAsset";

/**
 * Sube un archivo al Storage de Bunny.net y registra el MediaAsset en Mongo.
 * El navegador nunca ve la AccessKey: este Route Handler hace el PUT por su cuenta.
 */
export async function POST(req: NextRequest) {
  const session = await requireAdminApi();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });
  }

  const ext = ALLOWED_IMAGE_MIME_TYPES[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Tipo de archivo no permitido. Usá JPG, PNG, WEBP o GIF." },
      { status: 400 }
    );
  }

  if (file.size === 0) {
    return NextResponse.json({ error: "El archivo está vacío" }, { status: 400 });
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { error: `El archivo supera el tamaño máximo (${MAX_IMAGE_BYTES / (1024 * 1024)} MB)` },
      { status: 400 }
    );
  }

  const bunnyPath = generateBunnyPath(ext);
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    await uploadToBunny(bunnyPath, buffer, file.type);
  } catch {
    return NextResponse.json({ error: "No se pudo subir el archivo a Bunny.net" }, { status: 502 });
  }

  await connectToDatabase();
  const asset = await MediaAssetModel.create({
    filename: file.name.slice(0, 200),
    url: buildCdnUrl(bunnyPath),
    bunnyPath,
    type: "image",
    mimeType: file.type,
    sizeBytes: file.size,
    uploadedBy: session.user.id,
  });

  revalidatePath("/admin/media");

  return NextResponse.json(
    { id: String(asset._id), url: asset.url, filename: asset.filename },
    { status: 201 }
  );
}
