"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { ContactModel } from "@/models/Contact";
import { ContactSubmissionModel } from "@/models/ContactSubmission";

const statusSchema = z.enum(["new", "read", "archived"]);

const contactSubmitSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio"),
  email: z.string().trim().email("Correo inválido"),
  phone: z.string().trim().optional(),
  practiceArea: z.string().trim().optional(),
  message: z.string().trim().min(1, "El mensaje es obligatorio"),
  sourcePage: z.string().trim().optional(),
});

type SubmitResult = { ok: true } | { ok: false; error: string };

/**
 * Recibe un envío del formulario público (bloque `contactForm`). A
 * diferencia del resto de este archivo, NO requiere sesión: es la acción
 * pública que llama cualquier visitante del sitio.
 *
 * Identifica al contacto por email: si ya existía, actualiza su nombre y
 * teléfono con lo último enviado y agrega un nuevo `ContactSubmission`; si
 * es la primera vez, crea el contacto.
 */
export async function submitContact(formData: FormData): Promise<SubmitResult> {
  await connectToDatabase();

  const parsed = contactSubmitSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    practiceArea: formData.get("practiceArea") || undefined,
    message: formData.get("message"),
    sourcePage: formData.get("sourcePage") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const { name, email, phone, practiceArea, message, sourcePage } = parsed.data;

  const contact = await ContactModel.findOneAndUpdate(
    { email: email.toLowerCase() },
    { $set: { name, phone } },
    { upsert: true, new: true }
  );

  await ContactSubmissionModel.create({
    contactId: contact._id,
    message,
    practiceArea,
    sourcePage,
    status: "new",
  });

  revalidatePath("/admin/contacts");
  revalidatePath(`/admin/contacts/${contact._id}`);
  return { ok: true };
}

/** Cambia el estado de un formulario enviado por un contacto. */
export async function setSubmissionStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  await connectToDatabase();

  const id = String(formData.get("id") ?? "");
  const contactId = String(formData.get("contactId") ?? "");
  const parsed = statusSchema.safeParse(formData.get("status"));
  if (!parsed.success) return;

  await ContactSubmissionModel.updateOne({ _id: id }, { $set: { status: parsed.data } });
  revalidatePath("/admin/contacts");
  revalidatePath(`/admin/contacts/${contactId}`);
}

/** Elimina un formulario enviado (no el contacto). */
export async function deleteSubmission(formData: FormData): Promise<void> {
  await requireAdmin();
  await connectToDatabase();

  const id = String(formData.get("id") ?? "");
  const contactId = String(formData.get("contactId") ?? "");
  await ContactSubmissionModel.deleteOne({ _id: id });
  revalidatePath("/admin/contacts");
  revalidatePath(`/admin/contacts/${contactId}`);
}

/** Elimina un contacto junto con todos los formularios que envió. */
export async function deleteContact(formData: FormData): Promise<void> {
  await requireAdmin();
  await connectToDatabase();

  const id = String(formData.get("id") ?? "");
  await ContactSubmissionModel.deleteMany({ contactId: id });
  await ContactModel.deleteOne({ _id: id });
  revalidatePath("/admin/contacts");
  redirect("/admin/contacts");
}
