import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "./auth.config";
import { connectToDatabase } from "./db";
import { UserModel } from "@/models/User";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/**
 * Instancia completa de NextAuth (server). Incluye el provider Credentials que
 * valida contra MongoDB con bcrypt. Exporta:
 *  - `handlers` → para el route handler /api/auth/[...nextauth]
 *  - `auth`     → para leer la sesión en server components / actions
 *  - `signIn` / `signOut`
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        await connectToDatabase();

        const user = await UserModel.findOne({ email }).lean();
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: String(user._id),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
});
