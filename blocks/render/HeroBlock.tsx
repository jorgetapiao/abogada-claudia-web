import Image from "next/image";
import type { BlockRenderProps } from "../types";
import type { HeroData, HeroSettings } from "../schemas/hero";

/**
 * Componente PÚBLICO del bloque `hero` (server component).
 * El aspecto (colores, tipografía, espaciado) viene de los tokens del design
 * system; solo la `variant`/`height` (settings) alteran el layout.
 */
export function HeroBlock({
  data,
  settings,
}: BlockRenderProps<HeroData, HeroSettings>) {
  if (settings.variant === "sideBySide") {
    return <HeroSideBySide data={data} settings={settings} />;
  }
  if (settings.variant === "textOnly") {
    return <HeroTextOnly data={data} settings={settings} />;
  }
  return <HeroImageBackground data={data} settings={settings} />;
}

function heightClass(height: HeroSettings["height"]) {
  return height === "full"
    ? "min-h-[80vh] flex items-center"
    : "py-24 md:py-28";
}

function CtaButtons({ data, inverse }: { data: HeroData; inverse?: boolean }) {
  if (!data.primaryCtaLabel && !data.secondaryCtaLabel) return null;
  return (
    <div className="mt-8 flex flex-wrap gap-4">
      {data.primaryCtaLabel && (
        <a
          href={data.primaryCtaHref || "#"}
          className="inline-flex items-center rounded-md bg-accent px-6 py-3 font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          {data.primaryCtaLabel}
        </a>
      )}
      {data.secondaryCtaLabel && (
        <a
          href={data.secondaryCtaHref || "#"}
          className={`inline-flex items-center rounded-md border px-6 py-3 font-medium transition-colors ${
            inverse
              ? "border-white/60 text-white hover:bg-white/10"
              : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          }`}
        >
          {data.secondaryCtaLabel}
        </a>
      )}
    </div>
  );
}

function HeroImageBackground({ data, settings }: BlockRenderProps<HeroData, HeroSettings>) {
  return (
    <section className={`relative flex items-center justify-center overflow-hidden ${heightClass(settings.height)}`}>
      {data.backgroundImage && (
        <Image
          src={data.backgroundImage}
          alt=""
          fill
          priority
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-primary/70" />
      <div className="relative z-10 mx-auto w-full max-w-content px-6 text-center">
        <h1 className="text-4xl font-semibold text-primary-foreground md:text-5xl">
          {data.heading}
        </h1>
        {data.subheading && (
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/90">
            {data.subheading}
          </p>
        )}
        <div className="flex justify-center">
          <CtaButtons data={data} inverse />
        </div>
      </div>
    </section>
  );
}

function HeroSideBySide({ data, settings }: BlockRenderProps<HeroData, HeroSettings>) {
  return (
    <section className={heightClass(settings.height)}>
      <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-10 px-6 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-semibold md:text-5xl">{data.heading}</h1>
          {data.subheading && (
            <p className="mt-4 text-lg text-muted-foreground">{data.subheading}</p>
          )}
          <CtaButtons data={data} />
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
          {data.backgroundImage && (
            <Image src={data.backgroundImage} alt="" fill className="object-cover" />
          )}
        </div>
      </div>
    </section>
  );
}

function HeroTextOnly({ data, settings }: BlockRenderProps<HeroData, HeroSettings>) {
  return (
    <section className={`bg-muted ${heightClass(settings.height)}`}>
      <div className="mx-auto max-w-content px-6 text-center">
        <h1 className="text-4xl font-semibold md:text-5xl">{data.heading}</h1>
        {data.subheading && (
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {data.subheading}
          </p>
        )}
        <div className="flex justify-center">
          <CtaButtons data={data} />
        </div>
      </div>
    </section>
  );
}
