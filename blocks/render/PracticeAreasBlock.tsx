import { PracticeAreasTabs } from "@/components/site/PracticeAreasTabs";
import type { BlockRenderProps } from "../types";
import type { PracticeAreasData, PracticeAreasSettings } from "../schemas/practiceAreas";
import { sectionBackgroundClass, useLightText } from "../section-background";
import { Paragraphs } from "./paragraphs";

/** Componente PÚBLICO del bloque `practiceAreas` (server component). */
export function PracticeAreasBlock({
  data,
  settings,
}: BlockRenderProps<PracticeAreasData, PracticeAreasSettings>) {
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

        <PracticeAreasTabs tabs={data.tabs} columns={settings.columns} light={light} />
      </div>
    </section>
  );
}
