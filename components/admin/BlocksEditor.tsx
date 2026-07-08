"use client";

import { useState } from "react";
import { availableCatalog, getCatalogEntry } from "@/blocks/catalog";
import { getBlockEditor } from "@/blocks/editors/registry";
import type { BlockInstance, BlockType } from "@/blocks/types";

/**
 * Editor de la lista de bloques: agregar, reordenar, eliminar y editar el
 * contenido de cada bloque (mediante el Editor del `editors/registry`).
 * Es controlado: recibe `blocks` y notifica cambios con `onChange`.
 *
 * `allowedTypes` restringe el menú "Agregar bloque" (ej. PostEditor solo
 * ofrece título/párrafo/imagen, no el catálogo completo de páginas).
 */
export function BlocksEditor({
  blocks,
  onChange,
  allowedTypes,
}: {
  blocks: BlockInstance[];
  onChange: (blocks: BlockInstance[]) => void;
  allowedTypes?: BlockType[];
}) {
  const [adding, setAdding] = useState(false);

  function addBlock(type: string) {
    const entry = getCatalogEntry(type);
    if (!entry) return;
    // El hero lleva el <h1> de la página: solo tiene sentido como primer
    // bloque, así que solo se puede agregar cuando todavía no hay ninguno.
    if (type === "hero" && blocks.length > 0) return;
    const block: BlockInstance = {
      _id: crypto.randomUUID(),
      type,
      data: structuredClone(entry.default.data) as Record<string, unknown>,
      settings: structuredClone(entry.default.settings) as Record<string, unknown>,
    };
    onChange(type === "hero" ? [block, ...blocks] : [...blocks, block]);
    setAdding(false);
  }

  function removeBlock(index: number) {
    onChange(blocks.filter((_, i) => i !== index));
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= blocks.length) return;
    // El hero no puede cambiar de posición ni ser desplazado de la primera.
    if (blocks[index].type === "hero" || blocks[target].type === "hero") return;
    const copy = [...blocks];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    onChange(copy);
  }

  function updateBlock(index: number, next: { data: unknown; settings: unknown }) {
    onChange(
      blocks.map((b, i) =>
        i === index
          ? {
              ...b,
              data: next.data as Record<string, unknown>,
              settings: next.settings as Record<string, unknown>,
            }
          : b
      )
    );
  }

  return (
    <div className="grid gap-4">
      {blocks.length === 0 && (
        <p className="rounded-md border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
          Esta página todavía no tiene bloques. Agregá el primero abajo.
        </p>
      )}

      {blocks.map((block, index) => {
        const entry = getCatalogEntry(block.type);
        const Editor = getBlockEditor(block.type);
        return (
          <div key={block._id ?? index} className="rounded-lg border border-border">
            <div className="flex items-center justify-between border-b border-border bg-muted px-4 py-2">
              <span className="text-sm font-medium">{entry?.label ?? block.type}</span>
              <div className="flex items-center gap-1">
                {block.type !== "hero" && (
                  <>
                    <IconButton
                      label="Subir"
                      onClick={() => move(index, -1)}
                      disabled={index === 0 || blocks[index - 1]?.type === "hero"}
                    >
                      ↑
                    </IconButton>
                    <IconButton
                      label="Bajar"
                      onClick={() => move(index, 1)}
                      disabled={index === blocks.length - 1}
                    >
                      ↓
                    </IconButton>
                  </>
                )}
                <IconButton label="Eliminar" onClick={() => removeBlock(index)}>
                  ✕
                </IconButton>
              </div>
            </div>
            <div className="p-4">
              {Editor ? (
                <Editor
                  // Combinado con los valores por defecto del catálogo: si el
                  // bloque se guardó antes de que existiera un campo nuevo del
                  // schema (ej. "eyebrow" agregado a hero), no llega `undefined`
                  // al input controlado — ver bug de "uncontrolled to controlled".
                  data={{ ...(entry?.default.data as object), ...block.data }}
                  settings={{ ...(entry?.default.settings as object), ...block.settings }}
                  onChange={(next) => updateBlock(index, next)}
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  No hay editor para el bloque «{block.type}».
                </p>
              )}
            </div>
          </div>
        );
      })}

      <div className="relative">
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="w-full rounded-md border border-dashed border-border px-4 py-3 text-sm font-medium text-accent hover:bg-muted"
        >
          + Agregar bloque
        </button>
        {adding && (
          <div className="mt-2 grid gap-1 rounded-md border border-border bg-background p-2 shadow-sm">
            {availableCatalog(allowedTypes)
              .filter((entry) => entry.type !== "hero" || blocks.length === 0)
              .map((entry) => (
              <button
                key={entry.type}
                type="button"
                onClick={() => addBlock(entry.type)}
                className="rounded px-3 py-2 text-left text-sm hover:bg-muted"
              >
                <span className="font-medium">{entry.label}</span>
                {entry.description && (
                  <span className="block text-xs text-muted-foreground">
                    {entry.description}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function IconButton({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="rounded px-2 py-1 text-sm hover:bg-border/60 disabled:opacity-30"
    >
      {children}
    </button>
  );
}
