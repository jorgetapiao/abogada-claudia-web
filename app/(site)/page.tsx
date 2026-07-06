import { BlockRenderer } from "@/blocks/BlockRenderer";
import { getPublishedPage, HOME_SLUG } from "@/lib/pages";
import type { BlockInstance } from "@/blocks/types";

// Lee la DB en cada request. TODO (optimización): pasar a ISR con `revalidate`
// una vez definido el entorno, para servir la home estática y revalidarla.
export const dynamic = "force-dynamic";

/** Contenido de respaldo si por algún motivo la página "Inicio" no está disponible. */
const fallbackBlocks: BlockInstance[] = [
  {
    _id: "fallback-hero",
    type: "hero",
    data: {
      heading: "Asesoría legal en la que puede confiar",
      subheading: "Editá la página «Inicio» desde el panel /admin para reemplazar este contenido.",
      backgroundImage: "",
      primaryCtaLabel: "Contacto",
      primaryCtaHref: "/contacto",
      secondaryCtaLabel: "",
      secondaryCtaHref: "",
    },
    settings: { variant: "textOnly", height: "medium" },
  },
];

export default async function Home() {
  const page = await getPublishedPage(HOME_SLUG);
  const blocks = page?.blocks?.length ? page.blocks : fallbackBlocks;
  return <BlockRenderer blocks={blocks} />;
}
