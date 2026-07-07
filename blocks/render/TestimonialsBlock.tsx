import type { BlockRenderProps } from "../types";
import type { TestimonialsData, TestimonialsSettings } from "../schemas/testimonials";
import { sectionBackgroundClass, useLightText } from "../section-background";

/** Componente PÚBLICO del bloque `testimonials` (server component). */
export function TestimonialsBlock({
  data,
  settings,
}: BlockRenderProps<TestimonialsData, TestimonialsSettings>) {
  const light = useLightText(settings.background, settings.textColor);
  const gridClass = settings.columns === "2" ? "md:grid-cols-2" : "md:grid-cols-3";
  const isLeft = settings.align === "left";

  return (
    <section className={`px-6 py-16 ${sectionBackgroundClass(settings.background)}`}>
      <div className={`mx-auto max-w-content ${isLeft ? "text-left" : "text-center"}`}>
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
          <p
            className={`mt-4 max-w-2xl text-lg opacity-80 ${isLeft ? "" : "mx-auto"}`}
          >
            {data.paragraph}
          </p>
        )}

        {data.items.length > 0 && (
          <div className={`mt-12 grid grid-cols-1 gap-6 text-left ${gridClass}`}>
            {data.items.map((item, i) => (
              <figure key={i}>
                {item.quote && <blockquote className="text-base opacity-90">“{item.quote}”</blockquote>}
                {item.authorName && (
                  <figcaption className="mt-4 text-sm font-medium">{item.authorName}</figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
