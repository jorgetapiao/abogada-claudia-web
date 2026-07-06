import { BlockRenderer } from "@/blocks/BlockRenderer";
import { getPublishedPage } from "@/lib/pages";
import type { BlockInstance } from "@/blocks/types";

// Lee la DB en cada request. TODO (optimización): pasar a ISR con `revalidate`
// una vez definido el entorno, para servir la home estática y revalidarla.
export const dynamic = "force-dynamic";

/** Contenido de respaldo si aún no existe la página "home" en la base. */
const fallbackBlocks: BlockInstance[] = [
  {
    _id: "fallback-hero",
    type: "hero",
    data: {
      heading: "Asesoría legal en la que puede confiar",
      subheading:
        "Creá la página «Inicio» desde el panel /admin para reemplazar este contenido.",
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
  const page = await getPublishedPage("home");
  const blocks = page?.blocks?.length ? page.blocks : fallbackBlocks;
  return <BlockRenderer blocks={blocks} />;
}
