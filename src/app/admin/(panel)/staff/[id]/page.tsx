import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateDoctor } from "@/app/actions/staff";
import DoctorForm from "@/components/admin/DoctorForm";

export default async function EditarMedicoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doctorId = parseInt(id);

  const [doctor, especialidades, sedes] = await Promise.all([
    prisma.doctor.findUnique({
      where: { id: doctorId },
      include: {
        especialidades: true,
        sedes: true,
      },
    }),
    prisma.especialidad.findMany({ orderBy: { nombre: "asc" } }),
    prisma.sede.findMany({ orderBy: { nombre: "asc" } }),
  ]);

  if (!doctor) notFound();

  const action = updateDoctor.bind(null, doctorId);

  return <DoctorForm action={action} especialidades={especialidades} sedes={sedes} doctor={doctor} />;
}
