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
