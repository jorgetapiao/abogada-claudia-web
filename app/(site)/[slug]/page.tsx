import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@/blocks/BlockRenderer";
import { getPublishedPage } from "@/lib/pages";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublishedPage(slug);
  if (!page) return {};
  return {
    title: page.seo?.metaTitle ?? page.title,
    description: page.seo?.metaDescription,
  };
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPublishedPage(slug);
  if (!page) notFound();

  return <BlockRenderer blocks={page.blocks} />;
}
