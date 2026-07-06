import { randomUUID } from "crypto";
import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * Bloque de contenido embebido.
 *
 * - `_id`: String (no ObjectId) porque `BlocksEditor` genera el id en el
 *   cliente con `crypto.randomUUID()` al agregar un bloque nuevo, antes de
 *   que exista cualquier viaje al servidor.
 * - `type`: identificador del catálogo (ver src registry en blocks/). Se deja
 *   como String flexible a propósito: agregar un tipo de bloque nuevo NO debe
 *   requerir migrar el modelo. La validación de forma la hace Zod (registry)
 *   en la Server Action antes de guardar.
 * - `data`: contenido libre según el tipo (textos, URLs de imagen). Editable
 *   por la abogada.
 * - `settings`: variantes de estilo ACOTADAS, definidas por el programador
 *   (nunca colores/fuentes libres). El diseño vive en el código, no aquí.
 */
export const blockSchema = new Schema({
  _id: { type: String, default: () => randomUUID() },
  type: { type: String, required: true },
  data: { type: Schema.Types.Mixed, default: {} },
  settings: { type: Schema.Types.Mixed, default: {} },
});

const seoSchema = new Schema(
  {
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    ogImage: { type: String, trim: true },
  },
  { _id: false }
);

const pageSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    blocks: { type: [blockSchema], default: [] },
    seo: { type: seoSchema, default: {} },
    // Páginas de sistema (ej. Inicio, Contacto) que la abogada no puede eliminar.
    isSystem: { type: Boolean, default: false },
    // Navegación
    showInNav: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type Block = InferSchemaType<typeof blockSchema>;
export type Page = InferSchemaType<typeof pageSchema>;

export const PageModel: Model<Page> =
  (models.Page as Model<Page>) ?? model<Page>("Page", pageSchema);
