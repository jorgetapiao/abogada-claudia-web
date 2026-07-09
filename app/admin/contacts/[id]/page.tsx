import Link from "next/link";
import { notFound } from "next/navigation";
import { getContact } from "@/lib/contacts";
import { setSubmissionStatus, deleteSubmission } from "@/actions/contacts";

const dateFormatter = new Intl.DateTimeFormat("es-AR", { dateStyle: "long", timeStyle: "short" });

const statusLabel: Record<string, string> = {
  new: "Nuevo",
  read: "Leído",
  archived: "Archivado",
};

export default async function AdminContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contact = await getContact(id);
  if (!contact) notFound();

  return (
    <div>
      <Link href="/admin/contacts" className="text-sm text-muted-foreground hover:text-accent">
        ← Contactos
      </Link>

      <div className="mt-2 flex items-start justify-between gap-4">
        <h1 className="text-3xl font-semibold">{contact.name}</h1>
      </div>

      <div className="mt-4 grid gap-1 text-sm">
        <p>
          <span className="text-muted-foreground">Correo:</span> {contact.email}
        </p>
        {contact.phone && (
          <p>
            <span className="text-muted-foreground">Teléfono:</span> {contact.phone}
          </p>
        )}
        <p>
          <span className="text-muted-foreground">Contacto desde:</span>{" "}
          {dateFormatter.format(new Date(contact.createdAt))}
        </p>
      </div>

      <h2 className="mt-10 text-xl font-semibold">Formularios completados</h2>

      <ul className="mt-4 grid gap-4">
        {contact.submissions.length === 0 && (
          <li className="rounded-lg border border-border px-4 py-6 text-sm text-muted-foreground">
            Todavía no envió ningún formulario.
          </li>
        )}
        {contact.submissions.map((s) => (
          <li key={s._id} className="rounded-lg border border-border p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {dateFormatter.format(new Date(s.createdAt))}
                </p>
                {s.practiceArea && <p className="mt-1 text-xs text-accent">Área: {s.practiceArea}</p>}
              </div>
              <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                {statusLabel[s.status] ?? s.status}
              </span>
            </div>

            <p className="mt-3 whitespace-pre-wrap text-sm">{s.message}</p>

            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <StatusButton id={s._id} contactId={contact._id} status="read" label="Marcar leído" />
              <StatusButton id={s._id} contactId={contact._id} status="archived" label="Archivar" />
              <form action={deleteSubmission}>
                <input type="hidden" name="id" value={s._id} />
                <input type="hidden" name="contactId" value={contact._id} />
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
  contactId,
  status,
  label,
}: {
  id: string;
  contactId: string;
  status: string;
  label: string;
}) {
  return (
    <form action={setSubmissionStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="contactId" value={contactId} />
      <input type="hidden" name="status" value={status} />
      <button className="rounded-md border border-border px-3 py-1 hover:bg-muted">{label}</button>
    </form>
  );
}
