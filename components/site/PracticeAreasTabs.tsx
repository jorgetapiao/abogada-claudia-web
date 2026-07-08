"use client";

import { useState } from "react";

interface TabItem {
  subtitle: string;
  paragraph: string;
  buttonLabel: string;
  buttonHref: string;
}

interface Tab {
  label: string;
  items: TabItem[];
}

const columnsClass: Record<"2" | "3" | "4", string> = {
  "2": "md:grid-cols-2",
  "3": "md:grid-cols-3",
  "4": "md:grid-cols-4",
};

/**
 * Pestañas interactivas del bloque `practiceAreas`: alternan qué grupo de
 * tarjetas se muestra (ej. "Personas" / "Empresas"), la primera va
 * seleccionada por defecto.
 */
export function PracticeAreasTabs({
  tabs,
  columns,
  light,
}: {
  tabs: [Tab, Tab];
  columns: "2" | "3" | "4";
  light: boolean;
}) {
  const [active, setActive] = useState(0);
  const activeTab = tabs[active];

  return (
    <>
      <div className="mt-8 flex justify-center gap-3">
        {tabs.map((tab, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              i === active
                ? "bg-accent text-accent-foreground"
                : light
                  ? "border border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10"
                  : "border border-border text-foreground hover:bg-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab.items.length > 0 && (
        <div className={`mt-10 grid grid-cols-1 gap-6 text-center ${columnsClass[columns]}`}>
          {activeTab.items.map((item, i) => (
            <div key={i} className="rounded-lg border border-border p-6">
              {item.subtitle && (
                <h3
                  className={`text-xl font-semibold ${
                    light ? "text-primary-foreground" : "text-primary"
                  }`}
                >
                  {item.subtitle}
                </h3>
              )}
              {item.paragraph && <p className="mt-2 opacity-80">{item.paragraph}</p>}
              {item.buttonLabel && (
                <a
                  href={item.buttonHref || "#"}
                  className="mt-4 inline-flex items-center gap-1 font-medium text-accent hover:underline"
                >
                  {item.buttonLabel}
                  <span aria-hidden="true">→</span>
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
