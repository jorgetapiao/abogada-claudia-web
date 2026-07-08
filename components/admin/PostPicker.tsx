"use client";

import { useState } from "react";
import type { PublicPostSummary } from "@/lib/posts";

/**
 * Selector de publicaciones del blog para elegir cuáles destacar en el
 * bloque `featuredPosts`. Igual patrón que MediaPicker: modal, click para
 * agregar y cerrar. La lista de posts la carga y mantiene el componente
 * padre (se reusa tanto para este picker como para mostrar los ya elegidos).
 */
export function PostPicker({
  posts,
  isLoading,
  error,
  excludeIds,
  onAdd,
}: {
  posts: PublicPostSummary[] | null;
  isLoading: boolean;
  error: string | null;
  excludeIds: string[];
  onAdd: (post: PublicPostSummary) => void;
}) {
  const [open, setOpen] = useState(false);

  function select(post: PublicPostSummary) {
    onAdd(post);
    setOpen(false);
  }

  const available = posts?.filter((p) => !excludeIds.includes(p._id)) ?? null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="justify-self-start rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted"
      >
        + Elegir publicación
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-lg bg-background shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="text-lg font-semibold">Elegir publicación</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Cerrar
              </button>
            </div>

            <div className="overflow-y-auto p-4">
              {error && <p className="mb-3 text-sm text-destructive">{error}</p>}

              {isLoading && !posts && <p className="text-sm text-muted-foreground">Cargando…</p>}

              {available && available.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  {posts && posts.length > 0
                    ? "Ya elegiste todas las publicaciones disponibles."
                    : "Todavía no hay publicaciones publicadas."}
                </p>
              )}

              {available && available.length > 0 && (
                <ul className="grid gap-2">
                  {available.map((post) => (
                    <li key={post._id}>
                      <button
                        type="button"
                        onClick={() => select(post)}
                        className="w-full rounded-md border border-border px-3 py-2 text-left text-sm hover:bg-muted"
                      >
                        <span className="font-medium">{post.title}</span>
                        {post.excerpt && (
                          <span className="mt-0.5 block text-xs text-muted-foreground">
                            {post.excerpt}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
