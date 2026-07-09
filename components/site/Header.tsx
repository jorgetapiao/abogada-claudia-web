import Link from "next/link";
import { getNavPages } from "@/lib/pages";
import Image from "next/image";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { MobileNav } from "./MobileNav";

/**
 * Cabecera del sitio público. El menú se arma con las páginas publicadas que
 * tienen `showInNav`, más los enlaces fijos (Inicio, Blog).
 */
export async function Header() {
  const pages = await getNavPages();

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-22.25 border-b border-border bg-background">
      <div className="mx-auto flex h-full max-w-content items-center justify-between px-6">
        <Link href="/" className="relative h-18 w-18 overflow-hidden">
          <Image
            alt="Logo Abogada Claudia"
            src="https://abogada-claudia-web.b-cdn.net/2026/07/ChatGPT%20Image%207%20jul%202026%2C%2000_59_11.png"
            fill
            className="scale-175 object-contain"
          />
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
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
          <WhatsAppButton />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <WhatsAppButton />
          <MobileNav pages={pages} />
        </div>
      </div>
    </header>
  );
}

function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/56946978661"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 font-medium text-accent-foreground transition-opacity hover:opacity-90"
    >
      <WhatsAppIcon className="h-4 w-4" />
      WhatsApp
    </a>
  );
}
