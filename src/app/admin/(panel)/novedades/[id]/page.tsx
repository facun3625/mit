import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateNovedad } from "@/app/actions/novedades";
import NovedadForm from "@/components/admin/NovedadForm";

export default async function EditarNovedadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [novedad, categorias] = await Promise.all([
    prisma.novedad.findUnique({ where: { id: parseInt(id) } }),
    prisma.categoriaNoticia.findMany({ orderBy: { nombre: "asc" } }),
  ]);
  if (!novedad) notFound();

  const action = updateNovedad.bind(null, novedad.id);
  return <NovedadForm action={action} categorias={categorias} novedad={novedad} />;
}
