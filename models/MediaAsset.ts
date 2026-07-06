import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * Metadatos de un archivo alojado en Bunny.net. MongoDB NO guarda el archivo,
 * solo su URL del CDN y la ruta en el Storage (necesaria para poder borrarlo).
 */
const mediaAssetSchema = new Schema(
  {
    filename: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true }, // URL pública del CDN (Pull Zone)
    bunnyPath: { type: String, required: true, trim: true }, // ruta en el Storage Zone
    type: { type: String, enum: ["image", "video"], required: true },
    mimeType: { type: String, trim: true },
    sizeBytes: { type: Number },
    width: { type: Number },
    height: { type: Number },
    alt: { type: String, trim: true }, // accesibilidad / SEO
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export type MediaAsset = InferSchemaType<typeof mediaAssetSchema>;

export const MediaAssetModel: Model<MediaAsset> =
  (models.MediaAsset as Model<MediaAsset>) ??
  model<MediaAsset>("MediaAsset", mediaAssetSchema);
