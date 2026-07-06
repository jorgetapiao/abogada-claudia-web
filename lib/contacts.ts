import { connectToDatabase } from "./db";
import { ContactModel } from "@/models/Contact";

export interface ContactItem {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  practiceArea?: string;
  status: "new" | "read" | "archived";
  sourcePage?: string;
  createdAt?: string;
}

function plain<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}

/** Lista de contactos, del más reciente al más antiguo. */
export async function getContacts(): Promise<ContactItem[]> {
  await connectToDatabase();
  const docs = await ContactModel.find().sort({ createdAt: -1 }).lean();
  return plain<ContactItem[]>(docs);
}
