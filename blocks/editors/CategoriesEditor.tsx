"use client";

import { MediaPicker } from "@/components/admin/MediaPicker";
import { SectionBackgroundField } from "@/components/admin/SectionBackgroundField";
import { TextColorField } from "@/components/admin/TextColorField";
import type { BlockEditorProps } from "../types";
import type { CategoriesData, CategoriesSettings, CategoryItem } from "../schemas/categories";

/** Formulario del PANEL para el bloque `categories`. */
export function CategoriesEditor({
  data,
  settings,
  onChange,
}: BlockEditorProps<CategoriesData, CategoriesSettings>) {
  const setData = (patch: Partial<CategoriesData>) =>
    onChange({ data: { ...data, ...patch }, settings });
  const setSettings = (patch: Partial<CategoriesSettings>) =>
    onChange({ data, settings: { ...settings, ...patch } });

  const setItem = (index: number, patch: Partial<CategoryItem>) => {
    const items = data.items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    setData({ items });
  };
  const addItem = () =>
    setData({
      items: [
        ...data.items,
        { image: "", title: "", paragraph: "", buttonLabel: "", buttonHref: "" },
      ],
    });
  const removeItem = (index: number) =>
    setData({ items: data.items.filter((_, i) => i !== index) });

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

      <Field label="Párrafo">
        <textarea
          value={data.paragraph}
          onChange={(e) => setData({ paragraph: e.target.value })}
          rows={2}
          className={inputClass}
        />
      </Field>

      <div className="grid gap-3">
        <span className="text-sm font-medium text-foreground">Categorías</span>
        {data.items.map((item, index) => (
          <div key={index} className="grid gap-2 rounded-md border border-border p-3">
            <MediaPicker
              label="Imagen"
              value={item.image}
              onChange={(url) => setItem(index, { image: url })}
            />
            <Field label="Título">
              <input
                type="text"
                value={item.title}
                onChange={(e) => setItem(index, { title: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Párrafo">
              <textarea
                value={item.paragraph}
                onChange={(e) => setItem(index, { paragraph: e.target.value })}
                rows={2}
                className={inputClass}
              />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Botón (texto)">
                <input
                  type="text"
                  value={item.buttonLabel}
                  onChange={(e) => setItem(index, { buttonLabel: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Botón (enlace)">
                <input
                  type="text"
                  value={item.buttonHref}
                  onChange={(e) => setItem(index, { buttonHref: e.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="justify-self-start text-sm text-destructive hover:underline"
            >
              Quitar categoría
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="justify-self-start rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted"
        >
          + Agregar categoría
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Columnas">
          <select
            value={settings.columns}
            onChange={(e) =>
              setSettings({ columns: e.target.value as CategoriesSettings["columns"] })
            }
            className={inputClass}
          >
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </Field>
        <SectionBackgroundField
          value={settings.background}
          onChange={(background) => setSettings({ background })}
        />
      </div>

      <TextColorField
        value={settings.textColor}
        onChange={(textColor) => setSettings({ textColor })}
      />
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
