import { prisma } from "@/lib/prisma";
import { createSede, updateSede, deleteSede } from "@/app/actions/config";
import InlineList from "@/components/admin/InlineList";

export default async function SedesPage() {
  const sedes = await prisma.sede.findMany({
    orderBy: { nombre: "asc" },
    include: { _count: { select: { doctores: true } } },
  });

  const items = sedes.map((s) => ({
    id: s.id,
    nombre: s.nombre,
    _count: { doctores: s._count.doctores },
    updateAction: updateSede.bind(null, s.id),
    deleteAction: deleteSede.bind(null, s.id),
  }));

  return (
    <InlineList
      items={items}
      title="Sedes"
      subtitle="Gestioná las sedes disponibles para asignar a los médicos."
      createAction={createSede}
    />
  );
}
