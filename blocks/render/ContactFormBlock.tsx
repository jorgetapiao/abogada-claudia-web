import { ContactForm } from "@/components/site/ContactForm";
import { CONTACT } from "@/components/site/contact-info";
import { SocialLinks } from "@/components/site/SocialLinks";
import type { BlockRenderProps } from "../types";
import type { ContactFormData, ContactFormSettings } from "../schemas/contactForm";
import { sectionBackgroundClass, useLightText } from "../section-background";
import { Paragraphs } from "./paragraphs";

/** Componente PÚBLICO del bloque `contactForm` (server component). */
export function ContactFormBlock({
  data,
  settings,
}: BlockRenderProps<ContactFormData, ContactFormSettings>) {
  const light = useLightText(settings.background, settings.textColor);
  // "Otro" siempre va al final, sin que la abogada tenga que agregarlo a mano.
  const services = [...data.services, "Otro"];

  return (
    <section className={`px-6 py-16 ${sectionBackgroundClass(settings.background)}`}>
      <div className="mx-auto grid max-w-content gap-12 md:grid-cols-2">
        <div>
          {data.heading && (
            <h2
              className={`text-3xl font-semibold md:text-4xl ${
                light ? "text-primary-foreground" : "text-primary"
              }`}
            >
              {data.heading}
            </h2>
          )}
          {data.paragraph && (
            <Paragraphs text={data.paragraph} spacing="mt-4" className="text-lg opacity-80" />
          )}

          <div className="mt-8 flex flex-col gap-2">
            <a href={CONTACT.phoneHref} className="hover:text-accent">
              {CONTACT.phoneDisplay}
            </a>
            <a href={`mailto:${CONTACT.email}`} className="hover:text-accent">
              {CONTACT.email}
            </a>
            <p className="opacity-80">{CONTACT.address}</p>
          </div>

          <SocialLinks className="mt-6" />
        </div>

        <ContactForm services={services} />
      </div>
    </section>
  );
}
