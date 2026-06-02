import { prisma } from "@/lib/prisma";
import { createDoctor } from "@/app/actions/staff";
import DoctorForm from "@/components/admin/DoctorForm";

export default async function NuevoMedicoPage() {
  const [especialidades, sedes] = await Promise.all([
    prisma.especialidad.findMany({ orderBy: { nombre: "asc" } }),
    prisma.sede.findMany({ orderBy: { nombre: "asc" } }),
  ]);

  return <DoctorForm action={createDoctor} especialidades={especialidades} sedes={sedes} />;
}
