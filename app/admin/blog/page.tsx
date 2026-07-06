import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { createPost, deletePost } from "@/actions/posts";

export default async function AdminBlogList() {
  const posts = await getAllPosts();

  return (
    <div>
      <h1 className="text-3xl font-semibold">Blog</h1>

      <form action={createPost} className="mt-6 flex gap-2">
        <input
          name="title"
          placeholder="Título del nuevo post"
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring"
        />
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          Crear post
        </button>
      </form>

      <ul className="mt-8 divide-y divide-border rounded-lg border border-border">
        {posts.length === 0 && (
          <li className="px-4 py-6 text-sm text-muted-foreground">No hay posts todavía.</li>
        )}
        {posts.map((p) => (
          <li key={p._id} className="flex items-center justify-between px-4 py-3">
            <div>
              <Link href={`/admin/blog/${p._id}`} className="font-medium hover:text-accent">
                {p.title}
              </Link>
              <span className="ml-2 text-xs text-muted-foreground">
                /{p.slug} · {p.status === "published" ? "Publicado" : "Borrador"}
              </span>
            </div>
            <form action={deletePost}>
              <input type="hidden" name="id" value={p._id} />
              <button className="text-sm text-destructive hover:underline">Eliminar</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
