import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

/**
 * Proxy (antes "middleware" — renombrado en Next.js 16). Corre en edge runtime,
 * por eso usa `authConfig` (edge-safe), no `lib/auth.ts`.
 *
 * Hace un chequeo OPTIMISTA de sesión para /admin (redirige a /login si no hay).
 * Nota: NO es la garantía de seguridad — cada page de /admin y cada Server
 * Action re-verifica con `requireAdmin()`.
 */
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: ["/admin/:path*"],
};
