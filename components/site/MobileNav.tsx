"use client";

import { useState } from "react";
import Link from "next/link";
import type { NavPage } from "@/lib/pages";

/** Menú de navegación en formato hamburguesa, solo visible en mobile (ver Header). */
export function MobileNav({ pages }: { pages: NavPage[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center text-foreground"
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
            <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        )}
      </button>

      <div
        className={`absolute inset-x-0 top-22.25 origin-top overflow-hidden border-b border-border bg-background px-6 shadow-sm transition-all duration-200 ease-out ${
          open
            ? "max-h-96 translate-y-0 py-4 opacity-100"
            : "pointer-events-none max-h-0 -translate-y-2 py-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-4 text-sm">
          <Link href="/" onClick={() => setOpen(false)} className="text-foreground hover:text-accent">
            Inicio
          </Link>
          {pages.map((p) => (
            <Link
              key={p._id}
              href={`/${p.slug}`}
              onClick={() => setOpen(false)}
              className="text-foreground hover:text-accent"
            >
              {p.title}
            </Link>
          ))}
          <Link href="/blog" onClick={() => setOpen(false)} className="text-foreground hover:text-accent">
            Blog
          </Link>
        </nav>
      </div>
    </div>
  );
}
