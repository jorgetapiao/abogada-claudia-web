"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BlocksEditor } from "./BlocksEditor";
import { updatePost } from "@/actions/posts";
import type { EditablePost } from "@/lib/posts";
import type { BlockInstance } from "@/blocks/types";

export function PostEditor({ post }: { post: EditablePost }) {
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [excerpt, setExcerpt] = useState(post.excerpt ?? "");
  const [status, setStatus] = useState<EditablePost["status"]>(post.status);
  const [content, setContent] = useState<BlockInstance[]>(post.content ?? []);
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  function save() {
    setMsg(null);
    startTransition(async () => {
      const res = await updatePost(post._id, { title, slug, excerpt, status, content });
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
          Datos del post
        </h2>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Título</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Resumen</span>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className={inputClass}
          />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Slug (URL)</span>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} className={inputClass} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Estado</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as EditablePost["status"])}
              className={inputClass}
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
            </select>
          </label>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Contenido
        </h2>
        <BlocksEditor blocks={content} onChange={setContent} />
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
