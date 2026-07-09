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
        {data.eyebrow && (
          <p
            className={`text-sm font-semibold uppercase tracking-wide ${
              light ? "text-primary-foreground/80" : "text-accent"
            }`}
          >
            {data.eyebrow}
          </p>
        )}
        {data.heading && (
          <h2
            className={`mt-2 text-3xl font-semibold md:text-4xl ${
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
          <div className={`mt-10 grid grid-cols-1 gap-6 text-center ${columnsClass[settings.columns]}`}>
            {data.items.map((item, i) => (
              <div key={i} className="flex flex-col items-center rounded-lg border border-border p-6">
                {item.image && (
                  <div className="relative -mx-6 -mt-6 mb-6 aspect-4/3 w-[calc(100%+3rem)] overflow-hidden rounded-t-lg bg-muted">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                )}
                {item.title && (
                  <h3
                    className={`text-xl font-semibold ${
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
                    className="mt-4 inline-flex w-fit items-center gap-1 font-medium text-accent hover:underline"
                  >
                    {item.buttonLabel}
                    <span aria-hidden="true">→</span>
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
