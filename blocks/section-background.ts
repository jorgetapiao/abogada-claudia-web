import { z } from "zod";

/**
 * Fondo de sección: variante ACOTADA por el programador, nunca un color
 * libre — la abogada elige entre estas opciones, no pinta con un selector de
 * color. Ver memoria "design-fixed-in-code": el diseño vive en el código.
 * Compartido entre bloques para que todos usen el mismo vocabulario/paleta.
 */
export const sectionBackgroundSchema = z.enum(["light", "muted", "dark", "accent"]).default("light");

export type SectionBackground = z.infer<typeof sectionBackgroundSchema>;

export const sectionBackgroundOptions: { value: SectionBackground; label: string }[] = [
  { value: "light", label: "Blanco" },
  { value: "muted", label: "Gris claro" },
  { value: "dark", label: "Azul institucional" },
  { value: "accent", label: "Bronce (acento)" },
];

/** Clases Tailwind (tokens de globals.css) para cada variante de fondo. */
export function sectionBackgroundClass(background: SectionBackground | undefined): string {
  switch (background) {
    case "muted":
      return "bg-muted text-foreground";
    case "dark":
      return "bg-primary text-primary-foreground";
    case "accent":
      return "bg-accent text-accent-foreground";
    default:
      return "bg-background text-foreground";
  }
}

/**
 * Color de TÍTULOS (h1-h4): `globals.css` los fija en navy a propósito para
 * toda la página, pero eso los vuelve invisibles sobre un fondo de sección
 * navy/bronce. "Automático" corrige ese contraste solo; las otras dos son
 * una elección deliberada de la abogada, también acotada a la paleta.
 */
export const textColorSchema = z.enum(["auto", "dark", "light"]).default("auto");

export type TextColor = z.infer<typeof textColorSchema>;

export const textColorOptions: { value: TextColor; label: string }[] = [
  { value: "auto", label: "Automático (según el fondo)" },
  { value: "dark", label: "Oscuro (navy)" },
  { value: "light", label: "Claro (blanco)" },
];

/** true si, para este fondo y esta elección de color, el texto debe ser claro. */
export function useLightText(background: SectionBackground, textColor: TextColor): boolean {
  if (textColor === "light") return true;
  if (textColor === "dark") return false;
  return background === "dark" || background === "accent"; // auto
}
