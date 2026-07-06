import { getBlockDefinition } from "@/blocks/registry";
import type { BlockInstance } from "@/blocks/types";

/**
 * Valida y normaliza una lista de bloques contra los schemas del registry
 * (server). Descarta tipos desconocidos y, si el contenido no valida, cae a los
 * valores por defecto del bloque. Se usa en las Server Actions antes de guardar.
 */
export function validateBlocks(input: unknown): BlockInstance[] {
  if (!Array.isArray(input)) return [];

  const out: BlockInstance[] = [];
  for (const raw of input) {
    if (!raw || typeof raw !== "object") continue;
    const b = raw as {
      _id?: string;
      type?: string;
      data?: unknown;
      settings?: unknown;
    };
    if (!b.type) continue;

    const def = getBlockDefinition(b.type);
    if (!def) continue; // tipo no registrado → se descarta

    const data = def.dataSchema.safeParse(b.data ?? {});
    const settings = def.settingsSchema.safeParse(b.settings ?? {});

    out.push({
      _id: b._id,
      type: b.type,
      data: data.success ? data.data : def.default.data,
      settings: settings.success ? settings.data : def.default.settings,
    });
  }
  return out;
}
