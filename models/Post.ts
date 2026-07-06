import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { blockSchema } from "./Page";

/**
 * Post del blog. Reutiliza el mismo sistema de bloques que las páginas
 * (`content: blockSchema[]`) para no mantener dos editores distintos.
 */
const postSeoSchema = new Schema(
  {
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    ogImage: { type: String, trim: true },
  },
  { _id: false }
);

const postSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, trim: true },
    coverImage: { type: String, trim: true }, // URL del CDN de Bunny
    content: { type: [blockSchema], default: [] },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    tags: { type: [String], default: [] },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    publishedAt: { type: Date },
    seo: { type: postSeoSchema, default: {} },
  },
  { timestamps: true }
);

export type Post = InferSchemaType<typeof postSchema>;

export const PostModel: Model<Post> =
  (models.Post as Model<Post>) ?? model<Post>("Post", postSchema);
