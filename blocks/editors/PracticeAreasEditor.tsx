"use client";

import { SectionBackgroundField } from "@/components/admin/SectionBackgroundField";
import { TextColorField } from "@/components/admin/TextColorField";
import type { BlockEditorProps } from "../types";
import type {
  PracticeAreaItem,
  PracticeAreasData,
  PracticeAreasSettings,
} from "../schemas/practiceAreas";

/** Formulario del PANEL para el bloque `practiceAreas`. */
export function PracticeAreasEditor({
  data,
  settings,
  onChange,
}: BlockEditorProps<PracticeAreasData, PracticeAreasSettings>) {
  const setData = (patch: Partial<PracticeAreasData>) =>
    onChange({ data: { ...data, ...patch }, settings });
  const setSettings = (patch: Partial<PracticeAreasSettings>) =>
    onChange({ data, settings: { ...settings, ...patch } });

  const setTab = (tabIndex: 0 | 1, patch: Partial<PracticeAreasData["tabs"][number]>) => {
    const tabs = [...data.tabs] as PracticeAreasData["tabs"];
    tabs[tabIndex] = { ...tabs[tabIndex], ...patch };
    setData({ tabs });
  };
  const setTabItem = (tabIndex: 0 | 1, itemIndex: number, patch: Partial<PracticeAreaItem>) => {
    const items = data.tabs[tabIndex].items.map((item, i) =>
      i === itemIndex ? { ...item, ...patch } : item
    );
    setTab(tabIndex, { items });
  };
  const addTabItem = (tabIndex: 0 | 1) =>
    setTab(tabIndex, {
      items: [
        ...data.tabs[tabIndex].items,
        { subtitle: "", paragraph: "", buttonLabel: "", buttonHref: "" },
      ],
    });
  const removeTabItem = (tabIndex: 0 | 1, itemIndex: number) =>
    setTab(tabIndex, { items: data.tabs[tabIndex].items.filter((_, i) => i !== itemIndex) });

  return (
    <div className="grid gap-4">
      <Field label="Texto pequeño (arriba del título)">
        <input
          type="text"
          value={data.eyebrow}
          onChange={(e) => setData({ eyebrow: e.target.value })}
          className={inputClass}
        />
      </Field>

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

      {([0, 1] as const).map((tabIndex) => (
        <div key={tabIndex} className="grid gap-3 rounded-md border border-border p-3">
          <Field label={`Botón ${tabIndex + 1} (texto)`}>
            <input
              type="text"
              value={data.tabs[tabIndex].label}
              onChange={(e) => setTab(tabIndex, { label: e.target.value })}
              className={inputClass}
            />
          </Field>

          <div className="grid gap-2">
            <span className="text-sm font-medium text-foreground">
              Tarjetas de &quot;{data.tabs[tabIndex].label || `Botón ${tabIndex + 1}`}&quot;
            </span>
            {data.tabs[tabIndex].items.map((item, itemIndex) => (
              <div key={itemIndex} className="grid gap-2 rounded-md border border-border p-3">
                <Field label="Subtítulo">
                  <input
                    type="text"
                    value={item.subtitle}
                    onChange={(e) => setTabItem(tabIndex, itemIndex, { subtitle: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Párrafo">
                  <textarea
                    value={item.paragraph}
                    onChange={(e) =>
                      setTabItem(tabIndex, itemIndex, { paragraph: e.target.value })
                    }
                    rows={2}
                    className={inputClass}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Botón (texto)">
                    <input
                      type="text"
                      value={item.buttonLabel}
                      onChange={(e) =>
                        setTabItem(tabIndex, itemIndex, { buttonLabel: e.target.value })
                      }
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Botón (enlace)">
                    <input
                      type="text"
                      value={item.buttonHref}
                      onChange={(e) =>
                        setTabItem(tabIndex, itemIndex, { buttonHref: e.target.value })
                      }
                      className={inputClass}
                    />
                  </Field>
                </div>
                <button
                  type="button"
                  onClick={() => removeTabItem(tabIndex, itemIndex)}
                  className="justify-self-start text-sm text-destructive hover:underline"
                >
                  Quitar tarjeta
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addTabItem(tabIndex)}
              className="justify-self-start rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted"
            >
              + Agregar tarjeta
            </button>
          </div>
        </div>
      ))}

      <div className="grid grid-cols-2 gap-4">
        <Field label="Columnas">
          <select
            value={settings.columns}
            onChange={(e) =>
              setSettings({ columns: e.target.value as PracticeAreasSettings["columns"] })
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
