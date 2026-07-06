import Link from "next/link";
import { getAllPages } from "@/lib/pages";
import { createPage, deletePage } from "@/actions/pages";

export default async function AdminPagesList() {
  const pages = await getAllPages();

  return (
    <div>
      <h1 className="text-3xl font-semibold">Páginas</h1>

      <form action={createPage} className="mt-6 flex gap-2">
        <input
          name="title"
          placeholder="Título de la nueva página"
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring"
        />
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          Crear página
        </button>
      </form>

      <ul className="mt-8 divide-y divide-border rounded-lg border border-border">
        {pages.length === 0 && (
          <li className="px-4 py-6 text-sm text-muted-foreground">No hay páginas todavía.</li>
        )}
        {pages.map((p) => (
          <li key={p._id} className="flex items-center justify-between px-4 py-3">
            <div>
              <Link href={`/admin/pages/${p._id}`} className="font-medium hover:text-accent">
                {p.title}
              </Link>
              <span className="ml-2 text-xs text-muted-foreground">
                /{p.slug} · {p.status === "published" ? "Publicada" : "Borrador"}
                {p.isSystem ? " · sistema" : ""}
              </span>
            </div>
            {!p.isSystem && (
              <form action={deletePage}>
                <input type="hidden" name="id" value={p._id} />
                <button className="text-sm text-destructive hover:underline">Eliminar</button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
