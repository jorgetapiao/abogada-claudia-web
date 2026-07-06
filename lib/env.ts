import { z } from "zod";

/**
 * Validación de variables de entorno.
 *
 * La validación es *lazy* (se ejecuta al llamar `getEnv()`), no al importar el
 * módulo, para que la app pueda compilar/arrancar aunque el .env aún no esté
 * completo durante el desarrollo del esqueleto.
 */

const envSchema = z.object({
  // Base de datos
  MONGODB_URI: z.string().min(1, "MONGODB_URI es requerida"),

  // NextAuth v5 (Auth.js)
  AUTH_SECRET: z.string().min(1).optional(),

  // Bunny.net
  BUNNY_STORAGE_ZONE: z.string().optional(),
  BUNNY_STORAGE_PASSWORD: z.string().optional(),
  BUNNY_STORAGE_REGION: z.string().optional(),
  BUNNY_CDN_URL: z.string().url().optional(),
  BUNNY_CDN_TOKEN_KEY: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

export function getEnv(): Env {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Variables de entorno inválidas:\n${issues}`);
  }
  cached = parsed.data;
  return cached;
}
