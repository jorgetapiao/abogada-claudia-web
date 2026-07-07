"use client";

import type { BlockEditorProps } from "../types";
import type { ParagraphData, ParagraphSettings } from "../schemas/paragraph";

/** Formulario del PANEL para el bloque `paragraph`. */
export function ParagraphEditor({
  data,
  settings,
  onChange,
}: BlockEditorProps<ParagraphData, ParagraphSettings>) {
  const setData = (patch: Partial<ParagraphData>) =>
    onChange({ data: { ...data, ...patch }, settings });

  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-foreground">Texto</span>
      <textarea
        value={data.text}
        onChange={(e) => setData({ text: e.target.value })}
        rows={5}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring"
      />
    </label>
  );
}
