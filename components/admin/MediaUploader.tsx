"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function MediaUploader() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, startTransition] = useTransition();

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      try {
        const res = await fetch("/api/media/upload", { method: "POST", body: formData });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(body.error ?? "No se pudo subir el archivo");
          return;
        }
        router.refresh();
      } catch {
        setError("No se pudo subir el archivo (revisá tu conexión)");
      } finally {
        if (inputRef.current) inputRef.current.value = "";
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <label className="cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
        {isUploading ? "Subiendo..." : "Subir imagen"}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          disabled={isUploading}
          onChange={handleChange}
        />
      </label>
      <p className="text-xs text-muted-foreground">JPG, PNG, WEBP o GIF. Máximo 8 MB.</p>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
