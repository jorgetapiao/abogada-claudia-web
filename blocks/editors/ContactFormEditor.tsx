"use client";

import { SectionBackgroundField } from "@/components/admin/SectionBackgroundField";
import { TextColorField } from "@/components/admin/TextColorField";
import type { BlockEditorProps } from "../types";
import type { ContactFormData, ContactFormSettings } from "../schemas/contactForm";

/** Formulario del PANEL para el bloque `contactForm`. */
export function ContactFormEditor({
  data,
  settings,
  onChange,
}: BlockEditorProps<ContactFormData, ContactFormSettings>) {
  const setData = (patch: Partial<ContactFormData>) =>
    onChange({ data: { ...data, ...patch }, settings });
  const setSettings = (patch: Partial<ContactFormSettings>) =>
    onChange({ data, settings: { ...settings, ...patch } });

  const setService = (index: number, value: string) =>
    setData({ services: data.services.map((s, i) => (i === index ? value : s)) });
  const addService = () => setData({ services: [...data.services, ""] });
  const removeService = (index: number) =>
    setData({ services: data.services.filter((_, i) => i !== index) });

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

      <div className="grid gap-2">
        <span className="text-sm font-medium text-foreground">
          Servicios (opciones del formulario)
        </span>
        <p className="text-xs text-muted-foreground">
          La opción &quot;Otro&quot; se agrega sola al final, no hace falta escribirla.
        </p>
        {data.services.map((service, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={service}
              onChange={(e) => setService(index, e.target.value)}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => removeService(index)}
              className="text-sm text-destructive hover:underline"
            >
              Quitar
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addService}
          className="justify-self-start rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted"
        >
          + Agregar servicio
        </button>
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
