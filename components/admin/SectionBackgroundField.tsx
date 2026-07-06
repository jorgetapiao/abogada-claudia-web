"use client";

import { sectionBackgroundOptions, type SectionBackground } from "@/blocks/section-background";

/** Select de fondo de sección, reutilizable entre editores de bloque. */
export function SectionBackgroundField({
  value,
  onChange,
}: {
  value: SectionBackground;
  onChange: (value: SectionBackground) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-foreground">Fondo</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SectionBackground)}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring"
      >
        {sectionBackgroundOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
