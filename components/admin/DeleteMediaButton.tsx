"use client";

import { deleteMedia } from "@/actions/media";

export function DeleteMediaButton({ id, filename }: { id: string; filename: string }) {
  return (
    <form
      action={deleteMedia}
      onSubmit={(e) => {
        if (!confirm(`¿Eliminar "${filename}"? Esta acción no se puede deshacer.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="text-sm text-destructive hover:underline">Eliminar</button>
    </form>
  );
}
