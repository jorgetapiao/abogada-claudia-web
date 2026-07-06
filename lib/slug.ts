// Marcas diacríticas (acentos) en forma NFD. Se construye con RegExp para
// evitar caracteres combinantes literales en el código fuente.
const DIACRITICS = new RegExp("[\\u0300-\\u036f]", "g");

/** Convierte un texto en un slug URL-safe (minúsculas, guiones). */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(DIACRITICS, "") // quita acentos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
