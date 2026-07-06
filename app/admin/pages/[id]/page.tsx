import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageById } from "@/lib/pages";
import { PageEditor } from "@/components/admin/PageEditor";

export default async function AdminEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = await getPageById(id);
  if (!page) notFound();

  return (
    <div>
      <Link href="/admin/pages" className="text-sm text-muted-foreground hover:text-accent">
        ← Páginas
      </Link>
      <h1 className="mt-2 text-3xl font-semibold">Editar página</h1>
      <div className="mt-6">
        <PageEditor page={page} />
      </div>
    </div>
  );
}
