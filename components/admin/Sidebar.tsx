"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { href: "/admin", label: "Inicio" },
  { href: "/admin/pages", label: "Páginas" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/media", label: "Medios" },
  { href: "/admin/contacts", label: "Contactos" },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-muted">
      <div className="px-5 py-5">
        <span className="font-serif text-lg font-semibold text-primary">Panel</span>
      </div>
      <nav className="flex-1 px-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`block rounded-md px-3 py-2 text-sm ${
              isActive(l.href)
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-border/60"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="p-2">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full rounded-md px-3 py-2 text-left text-sm text-muted-foreground hover:bg-border/60"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
