"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { ContactModel } from "@/models/Contact";

const statusSchema = z.enum(["new", "read", "archived"]);

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
