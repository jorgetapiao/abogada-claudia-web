import Link from "next/link";
import { getNavPages } from "@/lib/pages";

/**
 * Cabecera del sitio público. El menú se arma con las páginas publicadas que
 * tienen `showInNav`, más los enlaces fijos (Inicio, Blog).
 */
export async function Header() {
  const pages = await getNavPages();

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-xl font-semibold text-primary">
          Abogada Claudia
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-foreground hover:text-accent">
            Inicio
          </Link>
          {pages.map((p) => (
            <Link key={p._id} href={`/${p.slug}`} className="text-foreground hover:text-accent">
              {p.title}
            </Link>
          ))}
          <Link href="/blog" className="text-foreground hover:text-accent">
            Blog
          </Link>
        </nav>
      </div>
    </header>
  );
}
