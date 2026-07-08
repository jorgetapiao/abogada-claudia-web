import Link from "next/link";
import { getAllPages } from "@/lib/pages";
import { createPage, deletePage, reorderPage } from "@/actions/pages";

export default async function AdminPagesList() {
  const pages = await getAllPages();
  const orderableIds = pages.filter((p) => !p.isSystem).map((p) => p._id);

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
        {pages.map((p) => {
          const orderIndex = orderableIds.indexOf(p._id);
          const isFirst = orderIndex <= 0;
          const isLast = orderIndex === -1 || orderIndex === orderableIds.length - 1;
          return (
            <li key={p._id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                {!p.isSystem && (
                  <div className="flex flex-col">
                    <form action={reorderPage}>
                      <input type="hidden" name="id" value={p._id} />
                      <input type="hidden" name="direction" value="up" />
                      <button
                        type="submit"
                        disabled={isFirst}
                        aria-label="Subir"
                        className="block leading-none text-muted-foreground hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        ▲
                      </button>
                    </form>
                    <form action={reorderPage}>
                      <input type="hidden" name="id" value={p._id} />
                      <input type="hidden" name="direction" value="down" />
                      <button
                        type="submit"
                        disabled={isLast}
                        aria-label="Bajar"
                        className="block leading-none text-muted-foreground hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </form>
                  </div>
                )}
                <div>
                  <Link href={`/admin/pages/${p._id}`} className="font-medium hover:text-accent">
                    {p.title}
                  </Link>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {p.slug === "/" ? "/" : `/${p.slug}`} ·{" "}
                    {p.status === "published" ? "Publicada" : "Borrador"}
                    {p.isSystem ? " · sistema" : ""}
                  </span>
                </div>
              </div>
              {!p.isSystem && (
                <form action={deletePage}>
                  <input type="hidden" name="id" value={p._id} />
                  <button className="text-sm text-destructive hover:underline">Eliminar</button>
                </form>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
