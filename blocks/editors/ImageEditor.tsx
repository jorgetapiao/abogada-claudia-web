"use client";

import { MediaPicker } from "@/components/admin/MediaPicker";
import { SectionBackgroundField } from "@/components/admin/SectionBackgroundField";
import type { BlockEditorProps } from "../types";
import type { ImageData, ImageSettings } from "../schemas/image";

/** Formulario del PANEL para el bloque `image`. */
export function ImageEditor({
  data,
  settings,
  onChange,
}: BlockEditorProps<ImageData, ImageSettings>) {
  const setData = (patch: Partial<ImageData>) =>
    onChange({ data: { ...data, ...patch }, settings });
  const setSettings = (patch: Partial<ImageSettings>) =>
    onChange({ data, settings: { ...settings, ...patch } });

  return (
    <div className="grid gap-4">
      <MediaPicker
        label="Imagen"
        value={data.image}
        onChange={(url) => setData({ image: url })}
      />

      <Field label="Texto alternativo" hint="Describe la imagen para accesibilidad y SEO.">
        <input
          type="text"
          value={data.alt}
          onChange={(e) => setData({ alt: e.target.value })}
          className={inputClass}
        />
      </Field>

      <Field label="Epígrafe (opcional)">
        <input
          type="text"
          value={data.caption}
          onChange={(e) => setData({ caption: e.target.value })}
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Ancho">
          <select
            value={settings.size}
            onChange={(e) => setSettings({ size: e.target.value as ImageSettings["size"] })}
            className={inputClass}
          >
            <option value="full">Completo</option>
            <option value="contained">Contenido</option>
          </select>
        </Field>
        <SectionBackgroundField
          value={settings.background}
          onChange={(background) => setSettings({ background })}
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={settings.rounded}
          onChange={(e) => setSettings({ rounded: e.target.checked })}
        />
        Bordes redondeados
      </label>
    </div>
  );
}

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-foreground">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}
