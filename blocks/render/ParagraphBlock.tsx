import type { BlockRenderProps } from "../types";
import type { ParagraphData, ParagraphSettings } from "../schemas/paragraph";
import { Paragraphs } from "./paragraphs";

/** Componente PÚBLICO del bloque `paragraph` (server component). */
export function ParagraphBlock({ data }: BlockRenderProps<ParagraphData, ParagraphSettings>) {
  if (!data.text) return null;
  return (
    <Paragraphs
      text={data.text}
      spacing="mt-4"
      className="text-lg leading-relaxed opacity-90"
    />
  );
}
