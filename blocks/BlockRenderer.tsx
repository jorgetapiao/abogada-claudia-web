import { getBlockDefinition } from "./registry";
import type { BlockInstance } from "./types";

/**
 * Recorre los bloques de una página/post y renderiza cada uno con su
 * componente público del registry. Un tipo desconocido se ignora en producción
 * (y se marca en desarrollo para no romper la página).
 */
export function BlockRenderer({ blocks }: { blocks: BlockInstance[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        const def = getBlockDefinition(block.type);
        const key = block._id ?? String(index);

        if (!def) {
          if (process.env.NODE_ENV !== "production") {
            return (
              <div
                key={key}
                className="mx-auto my-4 max-w-content rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
              >
                Bloque desconocido: <code>{block.type}</code> (no está en el registry).
              </div>
            );
          }
          return null;
        }

        const Render = def.Render;
        return <Render key={key} data={block.data} settings={block.settings} />;
      })}
    </>
  );
}
