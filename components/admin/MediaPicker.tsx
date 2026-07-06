"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { listMedia } from "@/actions/media";
import type { MediaListItem } from "@/lib/media";

/**
 * Selector de imágenes de la biblioteca de Bunny.net: elegir una existente o
 * subir una nueva, para usar en el campo `image` (URL del CDN) de un bloque.
 */
export function MediaPicker({
  value,
  onChange,
  label = "Imagen",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, startUpload] = useTransition();
  const [isLoading, startLoading] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    setOpen(true);
    setError(null);
    startLoading(async () => {
      try {
        setItems(await listMedia());
      } catch {
        setError("No se pudo cargar la biblioteca de medios");
      }
    });
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    startUpload(async () => {
      try {
        const res = await fetch("/api/media/upload", { method: "POST", body: formData });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(body.error ?? "No se pudo subir el archivo");
          return;
        }
        onChange(body.url);
        setItems(await listMedia());
      } catch {
        setError("No se pudo subir el archivo (revisá tu conexión)");
      } finally {
        if (inputRef.current) inputRef.current.value = "";
      }
    });
  }

  function select(url: string) {
    onChange(url);
    setOpen(false);
  }

  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-foreground">{label}</span>
      <div className="flex items-center gap-3">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
          {value && <Image src={value} alt="" fill className="object-cover" unoptimized />}
        </div>
        <div className="flex flex-col items-start gap-1">
          <button
            type="button"
            onClick={openPicker}
            className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted"
          >
            {value ? "Cambiar imagen" : "Elegir imagen"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-xs text-destructive hover:underline"
            >
              Quitar
            </button>
          )}
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-background shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="text-lg font-semibold">Biblioteca de medios</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Cerrar
              </button>
            </div>

            <div className="overflow-y-auto p-4">
              <label className="mb-4 inline-block cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
                {isUploading ? "Subiendo..." : "Subir nueva imagen"}
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  disabled={isUploading}
                  onChange={handleUpload}
                />
              </label>

              {error && <p className="mb-3 text-sm text-destructive">{error}</p>}

              {isLoading && !items && (
                <p className="text-sm text-muted-foreground">Cargando…</p>
              )}
              {items && items.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Todavía no subiste ningún archivo.
                </p>
              )}

              {items && items.length > 0 && (
                <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {items.map((m) => (
                    <li key={m._id}>
                      <button
                        type="button"
                        onClick={() => select(m.url)}
                        title={m.filename}
                        className={`relative block aspect-square w-full overflow-hidden rounded-md border hover:ring-2 hover:ring-ring ${
                          m.url === value ? "border-accent ring-2 ring-accent" : "border-border"
                        }`}
                      >
                        <Image src={m.url} alt={m.filename} fill className="object-cover" unoptimized />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
