import type { BlockRenderProps } from "../types";
import type { ParagraphData, ParagraphSettings } from "../schemas/paragraph";

/** Componente PÚBLICO del bloque `paragraph` (server component). */
export function ParagraphBlock({ data }: BlockRenderProps<ParagraphData, ParagraphSettings>) {
  if (!data.text) return null;
  return <p className="mt-4 whitespace-pre-line text-lg leading-relaxed opacity-90">{data.text}</p>;
}
