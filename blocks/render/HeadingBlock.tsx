import type { BlockRenderProps } from "../types";
import type { HeadingData, HeadingSettings } from "../schemas/heading";

/** Componente PÚBLICO del bloque `heading` (server component). */
export function HeadingBlock({ data }: BlockRenderProps<HeadingData, HeadingSettings>) {
  if (!data.text) return null;
  if (data.level === "h3") {
    return <h3 className="mt-8 text-2xl font-semibold">{data.text}</h3>;
  }
  return <h2 className="mt-10 text-3xl font-semibold">{data.text}</h2>;
}
