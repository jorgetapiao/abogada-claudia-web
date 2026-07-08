import { requireAdmin } from "@/lib/require-admin";
import { Sidebar } from "@/components/admin/Sidebar";

/**
 * Layout del panel. `requireAdmin()` protege TODAS las rutas /admin (y al usar
 * la sesión vía cookies, las vuelve dinámicas: no se prerenderizan en build).
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="mx-auto max-w-4xl px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
