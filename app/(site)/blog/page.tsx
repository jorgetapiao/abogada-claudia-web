import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";

// TODO (optimización): pasar a ISR con `revalidate` una vez definido el entorno.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog",
};

export default async function BlogIndex() {
  const posts = await getPublishedPosts();

  return (
    <main className="mx-auto max-w-content px-6 py-16">
      <h1 className="text-3xl font-semibold">Blog</h1>

      {posts.length === 0 ? (
        <p className="mt-6 text-muted-foreground">Todavía no hay publicaciones.</p>
      ) : (
        <ul className="mt-10 grid gap-8 sm:grid-cols-2">
          {posts.map((post) => (
            <li key={post._id} className="rounded-lg border border-border p-6">
              <h2 className="text-xl font-semibold">
                <Link href={`/blog/${post.slug}`} className="hover:text-accent">
                  {post.title}
                </Link>
              </h2>
              {post.excerpt && (
                <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
              )}
              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-block text-sm font-medium text-accent"
              >
                Leer más →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
