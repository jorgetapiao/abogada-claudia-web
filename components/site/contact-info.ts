import { FacebookIcon, InstagramIcon, LinkedInIcon } from "./SocialIcons";

/**
 * Datos de contacto ficticios (placeholder) — reemplazar por los reales de la
 * abogada. Fijos en código (ver memoria "design-fixed-in-code"), compartidos
 * entre el Footer y el bloque `contactForm` para no repetirlos ni desalinearlos.
 */
export const CONTACT = {
  phoneDisplay: "+56 9 4697 8661",
  phoneHref: "tel:+56946978661",
  email: "contacto@abogadaclaudia.com",
  address: "Av. Corrientes 1234, Piso 5, Quinta Normal, Chile",
};

export const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com/abogadaclaudia", Icon: InstagramIcon },
  { label: "Facebook", href: "https://facebook.com/abogadaclaudia", Icon: FacebookIcon },
  { label: "LinkedIn", href: "https://linkedin.com/company/abogadaclaudia", Icon: LinkedInIcon },
];
