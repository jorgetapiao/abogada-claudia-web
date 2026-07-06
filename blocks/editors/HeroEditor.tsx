"use client";

import { MediaPicker } from "@/components/admin/MediaPicker";
import type { BlockEditorProps } from "../types";
import type { HeroData, HeroSettings } from "../schemas/hero";

/**
 * Formulario del PANEL para el bloque `hero`. Edita solo CONTENIDO (data) y
 * variantes acotadas (settings) — nunca colores/tipografía.
 */
export function HeroEditor({
  data,
  settings,
  onChange,
}: BlockEditorProps<HeroData, HeroSettings>) {
  const setData = (patch: Partial<HeroData>) =>
    onChange({ data: { ...data, ...patch }, settings });
  const setSettings = (patch: Partial<HeroSettings>) =>
    onChange({ data, settings: { ...settings, ...patch } });

  return (
    <div className="grid gap-4">
      <Field label="Título">
        <input
          type="text"
          value={data.heading}
          onChange={(e) => setData({ heading: e.target.value })}
          className={inputClass}
        />
      </Field>

      <Field label="Subtítulo">
        <textarea
          value={data.subheading}
          onChange={(e) => setData({ subheading: e.target.value })}
          rows={2}
          className={inputClass}
        />
      </Field>

      <MediaPicker
        label="Imagen de fondo"
        value={data.backgroundImage}
        onChange={(url) => setData({ backgroundImage: url })}
      />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Botón principal (texto)">
          <input
            type="text"
            value={data.primaryCtaLabel}
            onChange={(e) => setData({ primaryCtaLabel: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="Botón principal (enlace)">
          <input
            type="text"
            value={data.primaryCtaHref}
            onChange={(e) => setData({ primaryCtaHref: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="Botón secundario (texto)">
          <input
            type="text"
            value={data.secondaryCtaLabel}
            onChange={(e) => setData({ secondaryCtaLabel: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="Botón secundario (enlace)">
          <input
            type="text"
            value={data.secondaryCtaHref}
            onChange={(e) => setData({ secondaryCtaHref: e.target.value })}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Variante">
          <select
            value={settings.variant}
            onChange={(e) =>
              setSettings({ variant: e.target.value as HeroSettings["variant"] })
            }
            className={inputClass}
          >
            <option value="imageBackground">Imagen de fondo</option>
            <option value="sideBySide">Texto e imagen</option>
            <option value="textOnly">Solo texto</option>
          </select>
        </Field>
        <Field label="Altura">
          <select
            value={settings.height}
            onChange={(e) =>
              setSettings({ height: e.target.value as HeroSettings["height"] })
            }
            className={inputClass}
          >
            <option value="medium">Media</option>
            <option value="full">Alta</option>
          </select>
        </Field>
      </div>
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
