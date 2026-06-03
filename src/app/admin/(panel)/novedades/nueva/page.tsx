import { prisma } from "@/lib/prisma";
import { createNovedad } from "@/app/actions/novedades";
import NovedadForm from "@/components/admin/NovedadForm";

export default async function NuevaNovedadPage() {
  const categorias = await prisma.categoriaNoticia.findMany({ orderBy: { nombre: "asc" } });
  return <NovedadForm key="nueva" action={createNovedad} categorias={categorias} />;
}
