import Image from "next/image";
import type { BlockRenderProps } from "../types";
import type { HeroData, HeroSettings } from "../schemas/hero";
import { sectionBackgroundClass, useLightText } from "../section-background";
import { Paragraphs } from "./paragraphs";

type HeadingTag = "h1" | "h2";

/**
 * Componente PÚBLICO del bloque `hero` (server component).
 * El aspecto (colores, tipografía, espaciado) viene de los tokens del design
 * system; solo la `variant`/`height` (settings) alteran el layout.
 */
export function HeroBlock(props: BlockRenderProps<HeroData, HeroSettings>) {
  return <HeroBlockBase {...props} headingTag="h1" />;
}

/**
 * Base compartida con `subHero` (ver render/SubHeroBlock.tsx): mismo layout y
 * campos, solo cambia la jerarquía del título (`<h1>` vs `<h2>`) — el hero
 * principal lleva el único `<h1>` de la página; el secundario no.
 */
export function HeroBlockBase({
  data,
  settings,
  headingTag,
}: BlockRenderProps<HeroData, HeroSettings> & { headingTag: HeadingTag }) {
  if (settings.variant === "sideBySide") {
    return <HeroSideBySide data={data} settings={settings} Heading={headingTag} />;
  }
  if (settings.variant === "textOnly") {
    return <HeroTextOnly data={data} settings={settings} Heading={headingTag} />;
  }
  return <HeroImageBackground data={data} settings={settings} Heading={headingTag} />;
}

/** Texto pequeño arriba del título — mismo estilo que el eyebrow de "Contenido con pestañas". */
function Eyebrow({ text, light }: { text: string; light: boolean }) {
  if (!text) return null;
  return (
    <p
      className={`text-sm font-semibold uppercase tracking-wide ${
        light ? "text-primary-foreground/80" : "text-accent"
      }`}
    >
      {text}
    </p>
  );
}

function heightClass(height: HeroSettings["height"]) {
  return height === "full"
    ? "min-h-[80vh] flex items-center"
    : "py-24 md:py-28";
}

function CtaButtons({
  data,
  inverse,
  primaryOnAccentBg,
}: {
  data: HeroData;
  inverse?: boolean;
  /** Fondo de sección "accent" (bronce): el botón principal pasa a navy para no perderse. */
  primaryOnAccentBg?: boolean;
}) {
  if (!data.primaryCtaLabel && !data.secondaryCtaLabel) return null;
  return (
    <div className="mt-8 flex flex-wrap gap-4">
      {data.primaryCtaLabel && (
        <a
          href={data.primaryCtaHref || "#"}
          className={`inline-flex items-center rounded-md px-6 py-3 font-medium transition-opacity hover:opacity-90 ${
            primaryOnAccentBg
              ? "bg-primary text-primary-foreground"
              : "bg-accent text-accent-foreground"
          }`}
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

function HeroImageBackground({
  data,
  settings,
  Heading,
}: BlockRenderProps<HeroData, HeroSettings> & { Heading: HeadingTag }) {
  // No hay una sección de color acá (es una imagen), pero según qué tan clara
  // u oscura sea esa imagen puede hacer falta texto claro u oscuro. "Automático"
  // asume que la imagen es oscura (el overlay navy de siempre); las otras dos
  // son la elección deliberada de la abogada, y el overlay se aclara con ellas.
  const light = useLightText("dark", settings.textColor);
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
      <div className={`absolute inset-0 ${light ? "bg-primary/70" : "bg-background/70"}`} />
      <div className="relative z-10 mx-auto w-full max-w-content px-6 text-center">
        <Eyebrow text={data.eyebrow} light={light} />
        <Heading
          className={`text-4xl font-semibold md:text-5xl ${
            light ? "text-primary-foreground" : "text-primary"
          }`}
        >
          {data.heading}
        </Heading>
        {data.subheading && (
          <Paragraphs
            text={data.subheading}
            spacing="mt-4"
            className={`mx-auto max-w-2xl text-lg ${
              light ? "text-primary-foreground/90" : "text-foreground/90"
            }`}
          />
        )}
        <div className="flex justify-center">
          <CtaButtons data={data} inverse={light} />
        </div>
      </div>
    </section>
  );
}

function HeroSideBySide({
  data,
  settings,
  Heading,
}: BlockRenderProps<HeroData, HeroSettings> & { Heading: HeadingTag }) {
  const light = useLightText(settings.background, settings.textColor);
  const headingClass = `text-4xl font-semibold md:text-5xl ${
    light ? "text-primary-foreground" : "text-primary"
  }`;
  const image = data.backgroundImage && (
    <Image src={data.backgroundImage} alt="" fill className="object-cover" />
  );
  const ctas = (
    <CtaButtons data={data} inverse={light} primaryOnAccentBg={settings.background === "accent"} />
  );

  if (settings.imagePosition === "center") {
    return (
      <section className={`${sectionBackgroundClass(settings.background)} ${heightClass(settings.height)}`}>
        <div className="mx-auto max-w-content px-6 text-center">
          <Eyebrow text={data.eyebrow} light={light} />
          <Heading className={headingClass}>{data.heading}</Heading>
          {data.subheading && (
            <Paragraphs
              text={data.subheading}
              spacing="mt-4"
              className="mx-auto max-w-2xl text-lg opacity-80"
            />
          )}
          <div className="flex justify-center">{ctas}</div>
          <div className="relative mx-auto mt-10 aspect-[4/3] w-full max-w-2xl overflow-hidden rounded-lg bg-muted">
            {image}
          </div>
        </div>
      </section>
    );
  }

  const imageFirst = settings.imagePosition === "left";
  return (
    <section className={`${sectionBackgroundClass(settings.background)} ${heightClass(settings.height)}`}>
      <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-10 px-6 md:grid-cols-2">
        <div className={imageFirst ? "md:order-2" : ""}>
          <Eyebrow text={data.eyebrow} light={light} />
          <Heading className={headingClass}>{data.heading}</Heading>
          {data.subheading && (
            <Paragraphs text={data.subheading} spacing="mt-4" className="text-lg opacity-80" />
          )}
          {ctas}
        </div>
        <div
          className={`relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted ${
            imageFirst ? "md:order-1" : ""
          }`}
        >
          {image}
        </div>
      </div>
    </section>
  );
}

function HeroTextOnly({
  data,
  settings,
  Heading,
}: BlockRenderProps<HeroData, HeroSettings> & { Heading: HeadingTag }) {
  const light = useLightText(settings.background, settings.textColor);
  const isLeft = settings.align === "left";
  return (
    <section className={`${sectionBackgroundClass(settings.background)} ${heightClass(settings.height)}`}>
      <div className={`mx-auto max-w-content px-6 ${isLeft ? "text-left" : "text-center"}`}>
        <Eyebrow text={data.eyebrow} light={light} />
        <Heading
          className={`text-4xl font-semibold md:text-5xl ${
            light ? "text-primary-foreground" : "text-primary"
          }`}
        >
          {data.heading}
        </Heading>
        {data.subheading && (
          <Paragraphs
            text={data.subheading}
            spacing="mt-4"
            className={`max-w-2xl text-lg opacity-80 ${isLeft ? "" : "mx-auto"}`}
          />
        )}
        <div className={`flex ${isLeft ? "justify-start" : "justify-center"}`}>
          <CtaButtons data={data} inverse={light} primaryOnAccentBg={settings.background === "accent"} />
        </div>
      </div>
    </section>
  );
}
