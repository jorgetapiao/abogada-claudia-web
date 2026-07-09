import { connectToDatabase } from "./db";
import { PageModel } from "@/models/Page";
import { PostModel } from "@/models/Post";
import { ContactModel } from "@/models/Contact";
import { ContactSubmissionModel } from "@/models/ContactSubmission";

export interface DashboardStats {
  pages: number;
  publishedPages: number;
  posts: number;
  publishedPosts: number;
  contactsNew: number;
  contactsTotal: number;
}

/** Conteos simples para el dashboard del panel. */
export async function getDashboardStats(): Promise<DashboardStats> {
  await connectToDatabase();
  const [
    pages,
    publishedPages,
    posts,
    publishedPosts,
    contactsNew,
    contactsTotal,
  ] = await Promise.all([
    PageModel.countDocuments(),
    PageModel.countDocuments({ status: "published" }),
    PostModel.countDocuments(),
    PostModel.countDocuments({ status: "published" }),
    ContactSubmissionModel.countDocuments({ status: "new" }),
    ContactModel.countDocuments(),
  ]);

  return { pages, publishedPages, posts, publishedPosts, contactsNew, contactsTotal };
}
