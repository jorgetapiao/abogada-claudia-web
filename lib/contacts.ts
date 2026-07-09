import { connectToDatabase } from "./db";
import { ContactModel } from "@/models/Contact";
import { ContactSubmissionModel } from "@/models/ContactSubmission";

export interface ContactListItem {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  submissionCount: number;
  unreadCount: number;
  lastSubmissionAt: string;
}

export interface ContactSubmissionItem {
  _id: string;
  message: string;
  practiceArea?: string;
  status: "new" | "read" | "archived";
  sourcePage?: string;
  createdAt: string;
}

export interface ContactDetail {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  submissions: ContactSubmissionItem[];
}

function plain<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}

/** Lista de contactos, del más reciente al más antiguo (por último formulario enviado). */
export async function getContacts(): Promise<ContactListItem[]> {
  await connectToDatabase();

  const [contacts, stats] = await Promise.all([
    ContactModel.find().lean(),
    ContactSubmissionModel.aggregate([
      {
        $group: {
          _id: "$contactId",
          submissionCount: { $sum: 1 },
          unreadCount: { $sum: { $cond: [{ $eq: ["$status", "new"] }, 1, 0] } },
          lastSubmissionAt: { $max: "$createdAt" },
        },
      },
    ]),
  ]);

  const statsByContact = new Map(stats.map((s) => [String(s._id), s]));

  const items = contacts.map((c) => {
    const s = statsByContact.get(String(c._id));
    return {
      _id: String(c._id),
      name: c.name,
      email: c.email,
      phone: c.phone,
      submissionCount: s?.submissionCount ?? 0,
      unreadCount: s?.unreadCount ?? 0,
      lastSubmissionAt: s?.lastSubmissionAt ?? c.createdAt,
    };
  });

  items.sort(
    (a, b) => new Date(b.lastSubmissionAt).getTime() - new Date(a.lastSubmissionAt).getTime()
  );

  return plain<ContactListItem[]>(items);
}

/** Un contacto con todos los formularios que envió, del más reciente al más antiguo. */
export async function getContact(id: string): Promise<ContactDetail | null> {
  await connectToDatabase();

  const [contact, submissions] = await Promise.all([
    ContactModel.findById(id).lean(),
    ContactSubmissionModel.find({ contactId: id }).sort({ createdAt: -1 }).lean(),
  ]);
  if (!contact) return null;

  return plain<ContactDetail>({ ...contact, submissions });
}
