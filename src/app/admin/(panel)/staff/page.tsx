import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, UserRound } from "lucide-react";
import StaffAdminTable from "@/components/admin/StaffAdminTable";

export default async function AdminStaffPage() {
  const [doctors, allSedes, allEsps] = await Promise.all([
    prisma.doctor.findMany({
      orderBy: [{ orden: "asc" }, { nombre: "asc" }],
      include: {
        especialidades: { include: { especialidad: true } },
        sedes: { include: { sede: true } },
      },
    }),
    prisma.sede.findMany({ orderBy: { nombre: "asc" } }),
    prisma.especialidad.findMany({ orderBy: { nombre: "asc" } }),
  ]);

  return (
    <div className="p-8 max-w-6xl w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-white/30 text-xs font-light tracking-[0.2em] uppercase mb-1">Gestión</p>
          <h1 className="text-white text-2xl font-light">Staff Médico</h1>
          <p className="text-white/30 text-xs mt-1">{doctors.length} médicos registrados</p>
        </div>
        <Link
          href="/admin/staff/nuevo"
          className="flex items-center gap-2 bg-mit-teal hover:bg-mit-teal-dark text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors duration-200"
        >
          <Plus size={16} strokeWidth={1.5} />
          Nuevo médico
        </Link>
      </div>

      {doctors.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-16 text-center">
          <UserRound size={40} strokeWidth={1} className="text-white/15 mx-auto mb-4" />
          <p className="text-white/30 text-sm font-light">No hay médicos cargados todavía.</p>
          <Link href="/admin/staff/nuevo" className="text-mit-teal text-xs font-medium mt-3 inline-block hover:underline">
            Agregar el primero →
          </Link>
        </div>
      ) : (
        <StaffAdminTable doctors={doctors} allSedes={allSedes} allEsps={allEsps} />
      )}
    </div>
  );
}
