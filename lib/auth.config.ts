import type { NextAuthConfig } from "next-auth";

/**
 * Configuración EDGE-SAFE de NextAuth.
 *
 * La usa el `proxy.ts` (que corre en edge runtime), por eso NO puede importar
 * mongoose ni bcrypt. El provider Credentials, que sí los necesita, se agrega
 * aparte en `lib/auth.ts`.
 */
export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [], // Credentials se agrega en lib/auth.ts (usa Node: bcrypt + mongoose)
  callbacks: {
    /** Controla el acceso a rutas protegidas (lo invoca el proxy). */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      if (isOnAdmin) return isLoggedIn; // si no hay sesión → redirige a /login
      return true;
    },
    /** Propaga id y role al token JWT. */
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    /** Expone id y role en la sesión. */
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string | undefined) ?? "";
        session.user.role = token.role as string | undefined;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
