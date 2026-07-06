import { getEnv } from "./env";

/**
 * Cliente mínimo de Bunny.net Storage (subida/borrado por servidor).
 *
 * Bunny Storage no ofrece URLs pre-firmadas por objeto, así que el flujo es
 * "proxy": el servidor recibe el archivo (Route Handler) y hace el PUT/DELETE
 * directo al Storage con la AccessKey secreta. Esa key nunca llega al navegador.
 */

function storageBaseUrl(): string {
  const env = getEnv();
  if (!env.BUNNY_STORAGE_REGION || !env.BUNNY_STORAGE_ZONE || !env.BUNNY_STORAGE_PASSWORD) {
    throw new Error("Bunny.net Storage no está configurado (faltan variables de entorno).");
  }
  return `https://${env.BUNNY_STORAGE_REGION}/${env.BUNNY_STORAGE_ZONE}`;
}

/** Sube un archivo al Storage Zone en la ruta indicada (la crea o la reemplaza). */
export async function uploadToBunny(
  path: string,
  body: Buffer,
  contentType: string
): Promise<void> {
  const env = getEnv();
  const res = await fetch(`${storageBaseUrl()}/${path}`, {
    method: "PUT",
    headers: {
      AccessKey: env.BUNNY_STORAGE_PASSWORD as string,
      "Content-Type": contentType,
    },
    body: new Uint8Array(body),
  });

  if (!res.ok) {
    throw new Error(`Bunny.net rechazó la subida (${res.status}).`);
  }
}

/** Borra un archivo del Storage Zone. No falla si ya no existe (404). */
export async function deleteFromBunny(path: string): Promise<void> {
  const env = getEnv();
  const res = await fetch(`${storageBaseUrl()}/${path}`, {
    method: "DELETE",
    headers: { AccessKey: env.BUNNY_STORAGE_PASSWORD as string },
  });

  if (!res.ok && res.status !== 404) {
    throw new Error(`Bunny.net rechazó el borrado (${res.status}).`);
  }
}

/** URL pública de entrega (CDN / Pull Zone) para una ruta del Storage. */
export function buildCdnUrl(path: string): string {
  const env = getEnv();
  if (!env.BUNNY_CDN_URL) {
    throw new Error("Falta BUNNY_CDN_URL.");
  }
  return `${env.BUNNY_CDN_URL.replace(/\/$/, "")}/${path}`;
}
