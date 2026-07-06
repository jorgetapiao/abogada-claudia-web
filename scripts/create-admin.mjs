// Crea (o actualiza) el usuario admin del panel.
//
// Uso (Node 22+, carga .env.local automáticamente):
//   node --env-file=.env.local scripts/create-admin.mjs <email> <password> ["Nombre"]
//
// Escribe en la misma colección "users" que usa el modelo de la app.

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const [, , email, password, name = "Administradora"] = process.argv;

if (!email || !password) {
  console.error(
    'Uso: node --env-file=.env.local scripts/create-admin.mjs <email> <password> ["Nombre"]'
  );
  process.exit(1);
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Falta MONGODB_URI (¿pasaste --env-file=.env.local?).");
  process.exit(1);
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, lowercase: true, trim: true },
    passwordHash: String,
    name: String,
    role: { type: String, default: "admin" },
  },
  { timestamps: true }
);
const User = mongoose.models.User || mongoose.model("User", userSchema);

await mongoose.connect(uri);

const passwordHash = await bcrypt.hash(password, 12);
await User.updateOne(
  { email: email.toLowerCase() },
  { $set: { email: email.toLowerCase(), passwordHash, name, role: "admin" } },
  { upsert: true }
);

console.log(`✓ Admin creado/actualizado: ${email.toLowerCase()}`);
await mongoose.disconnect();
