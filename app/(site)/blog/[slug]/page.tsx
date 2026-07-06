import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@/blocks/BlockRenderer";
import { getPostBySlug } from "@/lib/posts";

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

  return (
    <article className="mx-auto max-w-content px-6 py-16">
      <h1 className="text-4xl font-semibold">{post.title}</h1>
      <div className="mt-8">
        <BlockRenderer blocks={post.content} />
      </div>
    </article>
  );
}
