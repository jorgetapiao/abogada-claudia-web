"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { ContactModel } from "@/models/Contact";

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

  await ContactModel.create({ ...parsed.data, status: "new" });
  revalidatePath("/admin/contacts");
  return { ok: true };
}

/** Cambia el estado de un mensaje de contacto. */
export async function setContactStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  await connectToDatabase();

  const id = String(formData.get("id") ?? "");
  const parsed = statusSchema.safeParse(formData.get("status"));
  if (!parsed.success) return;

  await ContactModel.updateOne({ _id: id }, { $set: { status: parsed.data } });
  revalidatePath("/admin/contacts");
}

/** Elimina un mensaje de contacto. */
export async function deleteContact(formData: FormData): Promise<void> {
  await requireAdmin();
  await connectToDatabase();

  const id = String(formData.get("id") ?? "");
  await ContactModel.deleteOne({ _id: id });
  revalidatePath("/admin/contacts");
}
