"use client";

import { SectionBackgroundField } from "@/components/admin/SectionBackgroundField";
import { TextColorField } from "@/components/admin/TextColorField";
import type { BlockEditorProps } from "../types";
import type { TestimonialItem, TestimonialsData, TestimonialsSettings } from "../schemas/testimonials";

/** Formulario del PANEL para el bloque `testimonials`. */
export function TestimonialsEditor({
  data,
  settings,
  onChange,
}: BlockEditorProps<TestimonialsData, TestimonialsSettings>) {
  const setData = (patch: Partial<TestimonialsData>) =>
    onChange({ data: { ...data, ...patch }, settings });
  const setSettings = (patch: Partial<TestimonialsSettings>) =>
    onChange({ data, settings: { ...settings, ...patch } });

  const setItem = (index: number, patch: Partial<TestimonialItem>) => {
    const items = data.items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    setData({ items });
  };
  const addItem = () =>
    setData({ items: [...data.items, { quote: "", authorName: "" }] });
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
        <span className="text-sm font-medium text-foreground">Opiniones</span>
        {data.items.map((item, index) => (
          <div key={index} className="grid gap-2 rounded-md border border-border p-3">
            <Field label="Opinión">
              <textarea
                value={item.quote}
                onChange={(e) => setItem(index, { quote: e.target.value })}
                rows={2}
                className={inputClass}
              />
            </Field>
            <Field label="Nombre del cliente">
              <input
                type="text"
                value={item.authorName}
                onChange={(e) => setItem(index, { authorName: e.target.value })}
                className={inputClass}
              />
            </Field>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="justify-self-start text-sm text-destructive hover:underline"
            >
              Quitar opinión
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="justify-self-start rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted"
        >
          + Agregar opinión
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Columnas">
          <select
            value={settings.columns}
            onChange={(e) =>
              setSettings({ columns: e.target.value as TestimonialsSettings["columns"] })
            }
            className={inputClass}
          >
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </Field>
        <Field label="Alineación">
          <select
            value={settings.align}
            onChange={(e) =>
              setSettings({ align: e.target.value as TestimonialsSettings["align"] })
            }
            className={inputClass}
          >
            <option value="center">Centro</option>
            <option value="left">Izquierda</option>
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SectionBackgroundField
          value={settings.background}
          onChange={(background) => setSettings({ background })}
        />
        <TextColorField
          value={settings.textColor}
          onChange={(textColor) => setSettings({ textColor })}
        />
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
