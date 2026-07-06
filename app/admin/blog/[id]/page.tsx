import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostById } from "@/lib/posts";
import { PostEditor } from "@/components/admin/PostEditor";

export default async function AdminEditPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <div>
      <Link href="/admin/blog" className="text-sm text-muted-foreground hover:text-accent">
        ← Blog
      </Link>
      <h1 className="mt-2 text-3xl font-semibold">Editar post</h1>
      <div className="mt-6">
        <PostEditor post={post} />
      </div>
    </div>
  );
}
