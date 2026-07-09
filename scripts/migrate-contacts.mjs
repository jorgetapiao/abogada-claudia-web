// Migra la colección "contacts" del esquema viejo (un documento plano por
// cada envío del formulario) al esquema nuevo: contactos (personas,
// deduplicados por email) + "contactsubmissions" (cada envío, con
// contactId).
//
// Es seguro correrlo una sola vez. Si ya existen documentos en
// "contactsubmissions" no hace nada, para evitar duplicar datos si se
// ejecuta dos veces.
//
// Uso (Node 22+, carga .env.local automáticamente):
//   node --env-file=.env.local scripts/migrate-contacts.mjs

import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Falta MONGODB_URI (¿pasaste --env-file=.env.local?).");
  process.exit(1);
}

await mongoose.connect(uri);
const db = mongoose.connection.db;

const submissionsAlready = await db.collection("contactsubmissions").countDocuments();
if (submissionsAlready > 0) {
  console.log("Ya existen contactsubmissions, no se migra nada (¿ya se corrió este script?).");
  await mongoose.disconnect();
  process.exit(0);
}

const oldDocs = await db.collection("contacts").find().sort({ createdAt: 1 }).toArray();
if (oldDocs.length === 0) {
  console.log("No hay contactos que migrar.");
  await mongoose.disconnect();
  process.exit(0);
}

// email -> { _id, name, email, phone, createdAt }
const contactsByEmail = new Map();
const submissions = [];

for (const doc of oldDocs) {
  const email = String(doc.email ?? "").toLowerCase().trim();
  if (!email) continue; // documentos corruptos sin email: se descartan

  let contact = contactsByEmail.get(email);
  if (!contact) {
    contact = {
      _id: new mongoose.Types.ObjectId(),
      name: doc.name,
      email,
      phone: doc.phone,
      createdAt: doc.createdAt ?? new Date(),
      updatedAt: doc.createdAt ?? new Date(),
    };
    contactsByEmail.set(email, contact);
  } else {
    // el envío más reciente gana en nombre/teléfono
    contact.name = doc.name ?? contact.name;
    contact.phone = doc.phone ?? contact.phone;
    contact.updatedAt = doc.createdAt ?? contact.updatedAt;
  }

  submissions.push({
    contactId: contact._id,
    message: doc.message,
    practiceArea: doc.practiceArea,
    status: doc.status ?? "new",
    sourcePage: doc.sourcePage,
    createdAt: doc.createdAt ?? new Date(),
  });
}

const newContacts = [...contactsByEmail.values()];

if (submissions.length > 0) {
  await db.collection("contactsubmissions").insertMany(submissions);
}

await db.collection("contacts").deleteMany({});
if (newContacts.length > 0) {
  await db.collection("contacts").insertMany(newContacts);
}
await db.collection("contacts").createIndex({ email: 1 }, { unique: true });

console.log(
  `✓ Migrados ${oldDocs.length} envíos en ${newContacts.length} contactos únicos.`
);

await mongoose.disconnect();
