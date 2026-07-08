import { Fragment } from "react";

/**
 * Divide texto escrito en un <textarea> del panel en párrafos (líneas en
 * blanco) y saltos de línea simples (Enter una vez), y los renderiza como
 * elementos separados con un espaciado propio entre párrafos (`gap`) en vez
 * de depender de la altura de línea de una línea vacía (que con
 * `whitespace-pre-line` se ve desproporcionada frente al margen del título).
 */
export function Paragraphs({
  text,
  className = "",
  spacing = "",
  gap = "mt-3",
  as: Tag = "p",
}: {
  text: string;
  /** Clases de tipografía/color aplicadas a cada párrafo. */
  className?: string;
  /** Clases de espaciado (ej. margen respecto al elemento anterior) solo para el primer párrafo. */
  spacing?: string;
  /** Clases de espaciado entre párrafos siguientes. */
  gap?: string;
  as?: "p" | "blockquote";
}) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      {paragraphs.map((paragraph, i) => (
        <Tag key={i} className={`${i === 0 ? spacing : gap} ${className}`}>
          {paragraph.split("\n").map((line, j, arr) => (
            <Fragment key={j}>
              {line}
              {j < arr.length - 1 && <br />}
            </Fragment>
          ))}
        </Tag>
      ))}
    </>
  );
}
