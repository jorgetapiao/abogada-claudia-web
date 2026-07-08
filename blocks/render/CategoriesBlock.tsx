import Image from "next/image";
import type { BlockRenderProps } from "../types";
import type { CategoriesData, CategoriesSettings } from "../schemas/categories";
import { sectionBackgroundClass, useLightText } from "../section-background";
import { Paragraphs } from "./paragraphs";

const columnsClass: Record<CategoriesSettings["columns"], string> = {
  "2": "md:grid-cols-2",
  "3": "md:grid-cols-3",
  "4": "md:grid-cols-4",
};

/** Componente PÚBLICO del bloque `categories` (server component). */
export function CategoriesBlock({
  data,
  settings,
}: BlockRenderProps<CategoriesData, CategoriesSettings>) {
  const light = useLightText(settings.background, settings.textColor);

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

        {data.items.length > 0 && (
          <div className={`mt-12 grid grid-cols-1 gap-8 text-left ${columnsClass[settings.columns]}`}>
            {data.items.map((item, i) => (
              <div key={i} className="flex flex-col">
                {item.image && (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                )}
                {item.title && (
                  <h3
                    className={`mt-4 text-xl font-semibold ${
                      light ? "text-primary-foreground" : "text-primary"
                    }`}
                  >
                    {item.title}
                  </h3>
                )}
                {item.paragraph && (
                  <Paragraphs text={item.paragraph} spacing="mt-2" className="opacity-80" />
                )}
                {item.buttonLabel && (
                  <a
                    href={item.buttonHref || "#"}
                    className="mt-4 inline-flex w-fit items-center rounded-md bg-accent px-5 py-2.5 font-medium text-accent-foreground transition-opacity hover:opacity-90"
                  >
                    {item.buttonLabel}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
