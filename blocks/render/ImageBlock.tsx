import Image from "next/image";
import type { BlockRenderProps } from "../types";
import type { ImageData, ImageSettings } from "../schemas/image";

/**
 * Componente PÚBLICO del bloque `image` (server component). `size` controla
 * el ancho del contenedor; `rounded` agrega bordes redondeados a la imagen.
 */
export function ImageBlock({ data, settings }: BlockRenderProps<ImageData, ImageSettings>) {
  if (!data.image) return null;

  return (
    <figure
      className={`px-6 py-12 ${
        settings.size === "contained" ? "mx-auto max-w-content" : ""
      }`}
    >
      <div
        className={`relative aspect-video w-full overflow-hidden bg-muted ${
          settings.rounded ? "rounded-lg" : ""
        }`}
      >
        <Image src={data.image} alt={data.alt} fill className="object-cover" />
      </div>
      {data.caption && (
        <figcaption className="mt-3 text-center text-sm text-muted-foreground">
          {data.caption}
        </figcaption>
      )}
    </figure>
  );
}
