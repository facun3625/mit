import { prisma } from "@/lib/prisma";
import { createEspecialidad, updateEspecialidad, deleteEspecialidad } from "@/app/actions/config";
import InlineList from "@/components/admin/InlineList";

export default async function EspecialidadesPage() {
  const especialidades = await prisma.especialidad.findMany({
    orderBy: { nombre: "asc" },
    include: { _count: { select: { doctores: true } } },
  });

  const items = especialidades.map((e) => ({
    id: e.id,
    nombre: e.nombre,
    _count: { doctores: e._count.doctores },
    updateAction: updateEspecialidad.bind(null, e.id),
    deleteAction: deleteEspecialidad.bind(null, e.id),
  }));

  return (
    <InlineList
      items={items}
      title="Especialidades"
      subtitle="Gestioná las especialidades disponibles para asignar a los médicos."
      createAction={createEspecialidad}
    />
  );
}
