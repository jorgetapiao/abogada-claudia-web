"use client";

import { textColorOptions, type TextColor } from "@/blocks/section-background";

/** Select de color de título/texto, reutilizable entre editores de bloque. */
export function TextColorField({
  value,
  onChange,
}: {
  value: TextColor;
  onChange: (value: TextColor) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-foreground">Color del texto</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as TextColor)}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring"
      >
        {textColorOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className="mt-1 block text-xs text-muted-foreground">
        Usá &ldquo;Automático&rdquo; salvo que quieras un contraste distinto a propósito.
      </span>
    </label>
  );
}
