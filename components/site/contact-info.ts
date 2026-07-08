import { FacebookIcon, InstagramIcon, LinkedInIcon } from "./SocialIcons";

/**
 * Datos de contacto ficticios (placeholder) — reemplazar por los reales de la
 * abogada. Fijos en código (ver memoria "design-fixed-in-code"), compartidos
 * entre el Footer y el bloque `contactForm` para no repetirlos ni desalinearlos.
 */
export const CONTACT = {
  phoneDisplay: "+54 9 11 2233-4455",
  phoneHref: "tel:+5491122334455",
  email: "contacto@abogadaclaudia.com",
  address: "Av. Corrientes 1234, Piso 5, CABA, Argentina",
};

export const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com/abogadaclaudia", Icon: InstagramIcon },
  { label: "Facebook", href: "https://facebook.com/abogadaclaudia", Icon: FacebookIcon },
  { label: "LinkedIn", href: "https://linkedin.com/company/abogadaclaudia", Icon: LinkedInIcon },
];
