import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import StaffBrowser from "@/components/StaffBrowser";

export default async function StaffPage() {
  const [doctors, sedes, totalEsps] = await Promise.all([
    prisma.doctor.findMany({
      where: { activo: true },
      orderBy: [{ orden: "asc" }, { nombre: "asc" }],
      include: {
        especialidades: { include: { especialidad: true } },
        sedes: { include: { sede: true } },
      },
    }),
    prisma.sede.findMany({ orderBy: { nombre: "asc" } }),
    prisma.especialidad.count(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="bg-mit-teal text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/[0.05] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full bg-white/[0.04] translate-y-1/2 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-6 relative">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="inline-flex items-center gap-1.5 text-white/60 text-xs font-light tracking-wide hover:text-white transition-colors">
              <ArrowLeft size={13} strokeWidth={1.5} />
              Volver al inicio
            </Link>
            <div className="text-right">
              <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-white/55 mb-0.5">Nuestro equipo</p>
              <h1 className="text-2xl md:text-3xl font-light leading-none">Staff Médico</h1>
            </div>
          </div>
          <div className="border-t border-white/15 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { valor: `${doctors.length}`, label: "Profesionales activos" },
              { valor: `${totalEsps}`, label: "Especialidades" },
              { valor: `${sedes.length}`, label: "Sedes" },
              { valor: "45+", label: "Años de trayectoria" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-xl font-light tracking-tight text-white">{s.valor}</p>
                <p className="text-[10px] font-light text-white/60 tracking-wide leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browser */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <StaffBrowser doctors={doctors} sedes={sedes} />
      </section>
    </>
  );
}
