import Image from "next/image";
import Link from "next/link";
import { getPostsByIds } from "@/lib/posts";
import type { BlockRenderProps } from "../types";
import type { FeaturedPostsData, FeaturedPostsSettings } from "../schemas/featuredPosts";
import { sectionBackgroundClass, useLightText } from "../section-background";
import { Paragraphs } from "./paragraphs";

const columnsClass: Record<FeaturedPostsSettings["columns"], string> = {
  "2": "md:grid-cols-2",
  "3": "md:grid-cols-3",
};

/** Componente PÚBLICO del bloque `featuredPosts` (server component). */
export async function FeaturedPostsBlock({
  data,
  settings,
}: BlockRenderProps<FeaturedPostsData, FeaturedPostsSettings>) {
  const light = useLightText(settings.background, settings.textColor);
  const posts = await getPostsByIds(data.postIds);

  return (
    <section className={`px-6 py-16 ${sectionBackgroundClass(settings.background)}`}>
      <div className="mx-auto max-w-content text-center">
        {data.heading && (
          <h2
            className={`text-3xl font-semibold md:text-4xl ${
              light ? "text-primary-foreground" : "text-primary"
            }`}
          >
            {data.heading}
          </h2>
        )}
        {data.paragraph && (
          <Paragraphs
            text={data.paragraph}
            spacing="mt-4"
            className="mx-auto max-w-2xl text-lg opacity-80"
          />
        )}

        {posts.length > 0 && (
          <div className={`mt-12 grid grid-cols-1 gap-8 text-left ${columnsClass[settings.columns]}`}>
            {posts.map((post) => (
              <Link key={post._id} href={`/blog/${post.slug}`} className="group flex flex-col">
                {post.coverImage && (
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-muted">
                    <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                  </div>
                )}
                <h3
                  className={`mt-4 text-xl font-semibold group-hover:text-accent ${
                    light ? "text-primary-foreground" : "text-primary"
                  }`}
                >
                  {post.title}
                </h3>
                {post.excerpt && <p className="mt-2 opacity-80">{post.excerpt}</p>}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            href="/blog"
            className="inline-flex items-center rounded-md bg-accent px-6 py-3 font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            {data.buttonLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
