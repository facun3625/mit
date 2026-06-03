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
    <div className="p-8 max-w-2xl w-full">
      <p className="text-white/30 text-xs font-light tracking-[0.2em] uppercase mb-1">Configuración</p>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-light mb-1">Especialidades</h1>
          <p className="text-white/25 text-xs font-light">Gestioná las especialidades disponibles para asignar a los médicos.</p>
        </div>
        <form action={normalizeEspecialidades}>
          <button
            type="submit"
            title="Unifica entradas con el mismo nombre en distintas grafías (CARDIOLOGÍA → Cardiología)"
            className="flex-shrink-0 text-xs text-white/50 hover:text-white/90 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.1] rounded-lg px-3 py-1.5 transition-all whitespace-nowrap"
          >
            Normalizar duplicados
          </button>
        </form>
      </div>
      <InlineList
        items={items}
        title=""
        subtitle=""
        createAction={createEspecialidad}
      />
    </div>
  );
}
