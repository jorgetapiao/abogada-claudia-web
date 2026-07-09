import Link from "next/link";
import { getContacts } from "@/lib/contacts";
import { deleteContact } from "@/actions/contacts";

const dateFormatter = new Intl.DateTimeFormat("es-AR", { dateStyle: "long" });

export default async function AdminContactsPage() {
  const contacts = await getContacts();

  return (
    <div>
      <h1 className="text-3xl font-semibold">Contactos</h1>

      <ul className="mt-8 grid gap-4">
        {contacts.length === 0 && (
          <li className="rounded-lg border border-border px-4 py-6 text-sm text-muted-foreground">
            No hay contactos todavía.
          </li>
        )}
        {contacts.map((c) => (
          <li key={c._id} className="rounded-lg border border-border p-4">
            <div className="flex items-start justify-between gap-4">
              <Link href={`/admin/contacts/${c._id}`} className="group">
                <p className="font-medium group-hover:text-accent">
                  {c.name}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    · {c.email}
                    {c.phone ? ` · ${c.phone}` : ""}
                  </span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {c.submissionCount} {c.submissionCount === 1 ? "formulario" : "formularios"} ·
                  último {dateFormatter.format(new Date(c.lastSubmissionAt))}
                </p>
              </Link>
              {c.unreadCount > 0 && (
                <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                  {c.unreadCount} {c.unreadCount === 1 ? "sin leer" : "sin leer"}
                </span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <Link
                href={`/admin/contacts/${c._id}`}
                className="rounded-md border border-border px-3 py-1 hover:bg-muted"
              >
                Ver formularios
              </Link>
              <form action={deleteContact}>
                <input type="hidden" name="id" value={c._id} />
                <button className="rounded-md px-3 py-1 text-destructive hover:bg-muted">
                  Eliminar
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
