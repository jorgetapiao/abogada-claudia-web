import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "./db";
import { PostModel } from "@/models/Post";
import "@/models/User"; // registra el schema "User" para el populate() de abajo
import type { BlockInstance } from "@/blocks/types";

export interface PublicPostSummary {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  publishedAt?: string;
}

export interface PublicPost extends PublicPostSummary {
  content: BlockInstance[];
  author?: { name: string };
  seo?: { metaTitle?: string; metaDescription?: string; ogImage?: string };
}

export interface EditablePost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  status: "draft" | "published";
  content: BlockInstance[];
}

export interface PostListItem {
  _id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  updatedAt?: string;
}

function plain<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}

// ---------- Público ----------

export async function getPublishedPosts(): Promise<PublicPostSummary[]> {
  await connectToDatabase();
  const docs = await PostModel.find({ status: "published" })
    .sort({ publishedAt: -1, createdAt: -1 })
    .select("title slug excerpt coverImage publishedAt")
    .lean();
  return plain<PublicPostSummary[]>(docs);
}

export async function getPostBySlug(slug: string): Promise<PublicPost | null> {
  await connectToDatabase();
  const doc = await PostModel.findOne({ slug, status: "published" })
    .populate<{ author?: { name: string } }>("author", "name")
    .lean();
  return doc ? plain<PublicPost>(doc) : null;
}

// ---------- Panel ----------

export async function getAllPosts(): Promise<PostListItem[]> {
  await connectToDatabase();
  const docs = await PostModel.find()
    .sort({ updatedAt: -1 })
    .select("title slug status updatedAt")
    .lean();
  return plain<PostListItem[]>(docs);
}

export async function getPostById(id: string): Promise<EditablePost | null> {
  if (!isValidObjectId(id)) return null;
  await connectToDatabase();
  const doc = await PostModel.findById(id).lean();
  return doc ? plain<EditablePost>(doc) : null;
}
