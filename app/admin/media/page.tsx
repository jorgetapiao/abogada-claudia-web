import Image from "next/image";
import { getAllMedia } from "@/lib/media";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { DeleteMediaButton } from "@/components/admin/DeleteMediaButton";

function formatBytes(bytes?: number): string {
  if (!bytes) return "";
  const kb = bytes / 1024;
  return kb < 1024 ? `${kb.toFixed(0)} KB` : `${(kb / 1024).toFixed(1)} MB`;
}

export default async function AdminMediaPage() {
  const media = await getAllMedia();

  return (
    <div>
      <h1 className="text-3xl font-semibold">Medios</h1>
      <p className="mt-2 text-muted-foreground">
        Subí imágenes para usarlas en las páginas y el blog. Se guardan en Bunny.net.
      </p>

      <div className="mt-6">
        <MediaUploader />
      </div>

      {media.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">Todavía no subiste ningún archivo.</p>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {media.map((m) => (
            <li key={m._id} className="overflow-hidden rounded-lg border border-border">
              <div className="relative aspect-square bg-muted">
                <Image src={m.url} alt={m.filename} fill className="object-cover" unoptimized />
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-medium" title={m.filename}>
                  {m.filename}
                </p>
                <p className="text-xs text-muted-foreground">{formatBytes(m.sizeBytes)}</p>
                <div className="mt-1">
                  <DeleteMediaButton id={m._id} filename={m.filename} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
