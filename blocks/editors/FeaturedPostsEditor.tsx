"use client";

import { useEffect, useState } from "react";
import { listPublishedPosts } from "@/actions/posts";
import { PostPicker } from "@/components/admin/PostPicker";
import { SectionBackgroundField } from "@/components/admin/SectionBackgroundField";
import { TextColorField } from "@/components/admin/TextColorField";
import type { PublicPostSummary } from "@/lib/posts";
import type { BlockEditorProps } from "../types";
import type { FeaturedPostsData, FeaturedPostsSettings } from "../schemas/featuredPosts";

/** Formulario del PANEL para el bloque `featuredPosts`. */
export function FeaturedPostsEditor({
  data,
  settings,
  onChange,
}: BlockEditorProps<FeaturedPostsData, FeaturedPostsSettings>) {
  const [posts, setPosts] = useState<PublicPostSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listPublishedPosts()
      .then(setPosts)
      .catch(() => setError("No se pudo cargar la lista de publicaciones"));
  }, []);

  const setData = (patch: Partial<FeaturedPostsData>) =>
    onChange({ data: { ...data, ...patch }, settings });
  const setSettings = (patch: Partial<FeaturedPostsSettings>) =>
    onChange({ data, settings: { ...settings, ...patch } });

  const addPost = (post: PublicPostSummary) =>
    setData({ postIds: [...data.postIds, post._id] });
  const removePost = (id: string) =>
    setData({ postIds: data.postIds.filter((postId) => postId !== id) });

  return (
    <div className="grid gap-4">
      <Field label="Título">
        <input
          type="text"
          value={data.heading}
          onChange={(e) => setData({ heading: e.target.value })}
          className={inputClass}
        />
      </Field>

      <Field label="Párrafo">
        <textarea
          value={data.paragraph}
          onChange={(e) => setData({ paragraph: e.target.value })}
          rows={2}
          className={inputClass}
        />
      </Field>

      <div className="grid gap-3">
        <span className="text-sm font-medium text-foreground">Publicaciones elegidas</span>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {data.postIds.length === 0 && (
          <p className="text-sm text-muted-foreground">Todavía no elegiste ninguna.</p>
        )}
        {data.postIds.length > 0 && (
          <ul className="grid gap-2">
            {data.postIds.map((id) => {
              const post = posts?.find((p) => p._id === id);
              return (
                <li
                  key={id}
                  className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                >
                  <span className="text-sm">{post?.title ?? "Publicación no disponible"}</span>
                  <button
                    type="button"
                    onClick={() => removePost(id)}
                    className="text-sm text-destructive hover:underline"
                  >
                    Quitar
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <PostPicker
          posts={posts}
          isLoading={!posts && !error}
          error={error}
          excludeIds={data.postIds}
          onAdd={addPost}
        />
      </div>

      <Field label="Texto del botón">
        <input
          type="text"
          value={data.buttonLabel}
          onChange={(e) => setData({ buttonLabel: e.target.value })}
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Columnas">
          <select
            value={settings.columns}
            onChange={(e) =>
              setSettings({ columns: e.target.value as FeaturedPostsSettings["columns"] })
            }
            className={inputClass}
          >
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </Field>
        <SectionBackgroundField
          value={settings.background}
          onChange={(background) => setSettings({ background })}
        />
      </div>

      <TextColorField
        value={settings.textColor}
        onChange={(textColor) => setSettings({ textColor })}
      />
    </div>
  );
}

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-foreground">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}
