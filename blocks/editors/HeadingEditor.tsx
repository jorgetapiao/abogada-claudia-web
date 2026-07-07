"use client";

import type { BlockEditorProps } from "../types";
import type { HeadingData, HeadingSettings } from "../schemas/heading";

/** Formulario del PANEL para el bloque `heading`. */
export function HeadingEditor({
  data,
  settings,
  onChange,
}: BlockEditorProps<HeadingData, HeadingSettings>) {
  const setData = (patch: Partial<HeadingData>) =>
    onChange({ data: { ...data, ...patch }, settings });

  return (
    <div className="grid gap-4">
      <Field label="Texto">
        <input
          type="text"
          value={data.text}
          onChange={(e) => setData({ text: e.target.value })}
          className={inputClass}
        />
      </Field>
      <Field label="Nivel">
        <select
          value={data.level}
          onChange={(e) => setData({ level: e.target.value as HeadingData["level"] })}
          className={inputClass}
        >
          <option value="h2">Título de sección</option>
          <option value="h3">Subtítulo</option>
        </select>
      </Field>
    </div>
  );
}

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}
