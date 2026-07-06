import { getContacts } from "@/lib/contacts";
import { setContactStatus, deleteContact } from "@/actions/contacts";

const statusLabel: Record<string, string> = {
  new: "Nuevo",
  read: "Leído",
  archived: "Archivado",
};

export default async function AdminContactsPage() {
  const contacts = await getContacts();

  return (
    <div>
      <h1 className="text-3xl font-semibold">Contactos</h1>

      <ul className="mt-8 grid gap-4">
        {contacts.length === 0 && (
          <li className="rounded-lg border border-border px-4 py-6 text-sm text-muted-foreground">
            No hay mensajes todavía.
          </li>
        )}
        {contacts.map((c) => (
          <li key={c._id} className="rounded-lg border border-border p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">
                  {c.name}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    · {c.email}
                    {c.phone ? ` · ${c.phone}` : ""}
                  </span>
                </p>
                {c.practiceArea && (
                  <p className="mt-1 text-xs text-accent">Área: {c.practiceArea}</p>
                )}
              </div>
              <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                {statusLabel[c.status] ?? c.status}
              </span>
            </div>

            <p className="mt-3 whitespace-pre-wrap text-sm">{c.message}</p>

            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <StatusButton id={c._id} status="read" label="Marcar leído" />
              <StatusButton id={c._id} status="archived" label="Archivar" />
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

function StatusButton({
  id,
  status,
  label,
}: {
  id: string;
  status: string;
  label: string;
}) {
  return (
    <form action={setContactStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button className="rounded-md border border-border px-3 py-1 hover:bg-muted">
        {label}
      </button>
    </form>
  );
}
