"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BlocksEditor } from "./BlocksEditor";
import { updatePage } from "@/actions/pages";
import type { EditablePage } from "@/lib/pages";
import type { BlockInstance } from "@/blocks/types";

export function PageEditor({ page }: { page: EditablePage }) {
  const router = useRouter();
  const [title, setTitle] = useState(page.title);
  const [slug, setSlug] = useState(page.slug);
  const [status, setStatus] = useState<EditablePage["status"]>(page.status);
  const [blocks, setBlocks] = useState<BlockInstance[]>(page.blocks ?? []);
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  function save() {
    setMsg(null);
    startTransition(async () => {
      const res = await updatePage(page._id, { title, slug, status, blocks });
      if (res.ok) {
        setMsg({ type: "ok", text: "Cambios guardados." });
        router.refresh();
      } else {
        setMsg({ type: "err", text: res.error });
      }
    });
  }

  return (
    <div className="grid gap-8">
      <section className="grid gap-4 rounded-lg border border-border p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Datos de la página
        </h2>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Título</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Slug (URL)</span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              disabled={page.isSystem}
              className={`${inputClass} ${page.isSystem ? "opacity-60" : ""}`}
            />
            {page.isSystem && (
              <span className="mt-1 block text-xs text-muted-foreground">
                Es la página de inicio: siempre vive en la raíz del sitio.
              </span>
            )}
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Estado</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as EditablePage["status"])}
              className={inputClass}
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicada</option>
            </select>
          </label>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Bloques de contenido
        </h2>
        <BlocksEditor blocks={blocks} onChange={setBlocks} />
      </section>

      <div className="sticky bottom-0 flex items-center gap-4 border-t border-border bg-background py-4">
        <button
          onClick={save}
          disabled={pending}
          className="rounded-md bg-primary px-6 py-2 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Guardando…" : "Guardar cambios"}
        </button>
        {msg && (
          <span className={msg.type === "ok" ? "text-sm text-accent" : "text-sm text-destructive"}>
            {msg.text}
          </span>
        )}
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring";
