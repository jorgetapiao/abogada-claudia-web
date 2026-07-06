import type { DefaultSession } from "next-auth";

/**
 * Extiende los tipos de NextAuth para incluir `id` y `role` en la sesión,
 * el usuario y el token JWT.
 */
declare module "next-auth" {
  interface User {
    role?: string;
  }

  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}
