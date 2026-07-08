import Image from "next/image";
import Link from "next/link";
import { getNavPages } from "@/lib/pages";
import { CONTACT } from "./contact-info";
import { SocialLinks } from "./SocialLinks";

/**
 * Pie del sitio público. La navegación se arma igual que el Header (páginas
 * publicadas con `showInNav` + los enlaces fijos Inicio/Blog); el resto de los
 * datos (teléfono, correo, dirección, redes, aviso legal) es fijo en código
 * (ver memoria "design-fixed-in-code") con valores ficticios por ahora.
 */
export async function Footer() {
  const pages = await getNavPages();

  return (
    <footer className="mt-auto border-t border-border bg-muted">
      <div className="mx-auto max-w-content px-6 py-12">
        <div className="grid grid-cols-1 gap-8 text-sm sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Link href="/" className="relative block h-16 w-16 overflow-hidden">
              <Image
                alt="Logo Abogada Claudia"
                src="https://abogada-claudia-web.b-cdn.net/2026/07/ChatGPT%20Image%207%20jul%202026%2C%2000_59_11.png"
                fill
                className="scale-175 object-contain"
              />
            </Link>
            <p className="mt-3 text-muted-foreground">{CONTACT.address}</p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Navegación
            </h3>
            <nav className="mt-3 flex flex-col gap-2">
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

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Contacto
            </h3>
            <div className="mt-3 flex flex-col gap-2">
              <a href={CONTACT.phoneHref} className="text-foreground hover:text-accent">
                {CONTACT.phoneDisplay}
              </a>
              <a href={`mailto:${CONTACT.email}`} className="text-foreground hover:text-accent">
                {CONTACT.email}
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Redes
            </h3>
            <SocialLinks className="mt-3" />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Abogada Claudia. Todos los derechos reservados.</p>
          <Link href="/aviso-legal" className="hover:text-accent">
            Aviso legal
          </Link>
        </div>
      </div>
    </footer>
  );
}
