import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { BlockRenderer } from "@/blocks/BlockRenderer";
import { getPostBySlug } from "@/lib/posts";

const dateFormatter = new Intl.DateTimeFormat("es-AR", { dateStyle: "long" });

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.seo?.metaTitle ?? post.title,
    description: post.seo?.metaDescription ?? post.excerpt,
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const author = post.author?.name;
  const date = post.publishedAt ? dateFormatter.format(new Date(post.publishedAt)) : null;

  return (
    <article className="mx-auto max-w-content px-6 py-16">
      <h1 className="text-4xl font-semibold">{post.title}</h1>
      {(author || date) && (
        <div className="mt-3 text-sm text-muted-foreground">
          {author && <span>Por {author}</span>}
          {author && date && <span className="mx-2">·</span>}
          {date && <time dateTime={post.publishedAt}>{date}</time>}
        </div>
      )}
      {post.coverImage && (
        <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-lg bg-muted">
          <Image src={post.coverImage} alt={post.title} fill priority className="object-cover" />
        </div>
      )}
      <div className="mt-8">
        <BlockRenderer blocks={post.content} />
      </div>
    </article>
  );
}
