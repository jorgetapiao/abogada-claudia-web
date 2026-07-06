import { redirect } from "next/navigation";
import { auth } from "./auth";
import type { Session } from "next-auth";

/**
 * Re-verifica la sesión de admin. Llamar al inicio de cada page de /admin y de
 * cada Server Action del panel (el proxy no es garantía suficiente en Next 16).
 */
export async function requireAdmin(): Promise<Session> {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }
  return session;
}

/**
 * Variante para Route Handlers: no puede redirigir (la respuesta debe ser
 * JSON), así que devuelve `null` si no hay sesión de admin.
 */
export async function requireAdminApi(): Promise<Session | null> {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return null;
  }
  return session;
}
