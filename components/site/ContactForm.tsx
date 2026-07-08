"use client";

import { useRef, useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { submitContact } from "@/actions/contacts";

/** Formulario público de contacto (bloque `contactForm`). */
export function ContactForm({ services }: { services: string[] }) {
  const pathname = usePathname();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResult(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await submitContact(formData);
      if (res.ok) {
        setResult({ ok: true, message: "¡Gracias! Te vamos a contactar a la brevedad." });
        formRef.current?.reset();
      } else {
        setResult({ ok: false, message: res.error });
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid gap-4">
      <input type="hidden" name="sourcePage" value={pathname} />

      <Field label="Nombre y apellido">
        <input name="name" type="text" required className={inputClass} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Correo">
          <input name="email" type="email" required className={inputClass} />
        </Field>
        <Field label="Teléfono">
          <input name="phone" type="tel" className={inputClass} />
        </Field>
      </div>

      <Field label="Servicio de interés">
        <select name="practiceArea" defaultValue="" className={inputClass}>
          <option value="" disabled>
            Elegí una opción
          </option>
          {services.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Mensaje">
        <textarea name="message" rows={4} required className={inputClass} />
      </Field>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-md bg-accent px-6 py-3 font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Enviar"}
      </button>

      {result && (
        <p className={`text-sm ${result.ok ? "text-accent" : "text-destructive"}`}>
          {result.message}
        </p>
      )}
    </form>
  );
}

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
