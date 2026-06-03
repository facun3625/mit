import { prisma } from "@/lib/prisma";
import { createEspecialidad, updateEspecialidad, deleteEspecialidad, normalizeEspecialidades } from "@/app/actions/config";
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
    <div>
      <InlineList
        items={items}
        title="Especialidades"
        subtitle="Gestioná las especialidades disponibles para asignar a los médicos."
        createAction={createEspecialidad}
      />
      <form action={normalizeEspecialidades} className="px-8 pb-8 -mt-4">
        <button
          type="submit"
          className="text-xs text-white/25 hover:text-white/60 hover:bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 py-1.5 transition-all"
        >
          Normalizar nombres duplicados
        </button>
        <p className="text-[10px] text-white/20 font-light mt-1">
          Unifica entradas con el mismo nombre en distintas grafías (CARDIOLOGÍA → Cardiología).
        </p>
      </form>
    </div>
  );
}
