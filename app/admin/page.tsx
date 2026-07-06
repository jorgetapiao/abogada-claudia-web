import Link from "next/link";
import { getDashboardStats } from "@/lib/stats";

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Páginas publicadas", value: `${stats.publishedPages}/${stats.pages}`, href: "/admin/pages" },
    { label: "Posts publicados", value: `${stats.publishedPosts}/${stats.posts}`, href: "/admin/blog" },
    { label: "Contactos nuevos", value: String(stats.contactsNew), href: "/admin/contacts" },
    { label: "Contactos totales", value: String(stats.contactsTotal), href: "/admin/contacts" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-semibold">Inicio</h1>
      <p className="mt-1 text-muted-foreground">Resumen del sitio.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-lg border border-border p-6 transition-colors hover:border-accent"
          >
            <div className="text-3xl font-semibold text-primary">{c.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{c.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
