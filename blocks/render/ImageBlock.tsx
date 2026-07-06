import Image from "next/image";
import type { BlockRenderProps } from "../types";
import type { ImageData, ImageSettings } from "../schemas/image";
import { sectionBackgroundClass } from "../section-background";

/**
 * Componente PÚBLICO del bloque `image` (server component). `size` controla
 * el ancho del contenedor; `rounded` agrega bordes redondeados a la imagen;
 * `background` es el color de sección (banda de fondo detrás de la imagen).
 */
export function ImageBlock({ data, settings }: BlockRenderProps<ImageData, ImageSettings>) {
  if (!data.image) return null;

  return (
    <section className={`px-6 py-12 ${sectionBackgroundClass(settings.background)}`}>
      <figure className={settings.size === "contained" ? "mx-auto max-w-content" : ""}>
        <div
          className={`relative aspect-video w-full overflow-hidden bg-muted ${
            settings.rounded ? "rounded-lg" : ""
          }`}
        >
          <Image src={data.image} alt={data.alt} fill className="object-cover" />
        </div>
        {data.caption && (
          <figcaption className="mt-3 text-center text-sm opacity-80">{data.caption}</figcaption>
        )}
      </figure>
    </section>
  );
}
