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
      <p className="text-gray-500 text-xs font-light tracking-[0.2em] uppercase mb-1">Configuración</p>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-gray-900 text-2xl font-light mb-1">Especialidades</h1>
          <p className="text-gray-500 text-xs font-light">Gestioná las especialidades disponibles para asignar a los médicos.</p>
        </div>
        <form action={normalizeEspecialidades}>
          <button
            type="submit"
            title="Unifica entradas con el mismo nombre en distintas grafías (CARDIOLOGÍA → Cardiología)"
            className="flex-shrink-0 text-xs text-gray-600 hover:text-gray-800 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 transition-all whitespace-nowrap"
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
