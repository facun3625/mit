import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Users, Newspaper, Building2, Activity } from "lucide-react";

async function getStats() {
  const [doctors, novedades] = await Promise.all([
    prisma.doctor.count({ where: { activo: true } }),
    prisma.novedad.count({ where: { publicado: true } }),
  ]);
  return { doctors, novedades, centros: 9 };
}

export default async function AdminDashboard() {
  const session = await getSession();
  const stats = await getStats();

  const cards = [
    {
      label: "Médicos activos",
      value: stats.doctors,
      icon: Users,
      href: "/admin/staff",
      color: "teal",
    },
    {
      label: "Novedades",
      value: stats.novedades,
      icon: Newspaper,
      href: "/admin/novedades",
      color: "purple",
    },
    {
      label: "Centros médicos",
      value: stats.centros,
      icon: Building2,
      href: "/admin/centros",
      color: "teal",
    },
  ];

  return (
    <div className="p-8 max-w-5xl w-full">
      {/* Header */}
      <div className="mb-10">
        <p className="text-white/30 text-xs font-light tracking-[0.2em] uppercase mb-1">
          Panel de administración
        </p>
        <h1 className="text-white text-2xl font-light">Dashboard</h1>
        <p className="text-white/30 text-xs mt-1">
          Bienvenido, <span className="text-white/50">{session?.email}</span>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {cards.map(({ label, value, icon: Icon, href, color }) => (
          <a
            key={label}
            href={href}
            className="group bg-white/[0.03] border border-white/[0.07] rounded-xl p-6 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2 rounded-lg ${color === "teal" ? "bg-mit-teal/10" : "bg-[#5f2c82]/20"}`}>
                <Icon
                  size={18}
                  strokeWidth={1.5}
                  className={color === "teal" ? "text-mit-teal" : "text-[#9b59b6]"}
                />
              </div>
              <Activity size={12} strokeWidth={1.5} className="text-white/15 group-hover:text-white/30 transition-colors" />
            </div>
            <p className="text-3xl font-light text-white mb-1">{value}</p>
            <p className="text-xs text-white/35 font-light tracking-wide">{label}</p>
          </a>
        ))}
      </div>

      {/* Accesos rápidos */}
      <div>
        <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-white/25 mb-4">
          Accesos rápidos
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "Agregar médico", desc: "Crear nuevo perfil del staff", href: "/admin/staff/nuevo", icon: Users },
            { label: "Nueva novedad", desc: "Publicar artículo en novedades", href: "/admin/novedades/nueva", icon: Newspaper },
          ].map(({ label, desc, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 hover:bg-white/[0.05] hover:border-mit-teal/20 transition-all duration-300 group"
            >
              <div className="w-9 h-9 rounded-lg bg-mit-teal/10 flex items-center justify-center flex-shrink-0 group-hover:bg-mit-teal/20 transition-colors">
                <Icon size={16} strokeWidth={1.5} className="text-mit-teal" />
              </div>
              <div>
                <p className="text-sm text-white/70 font-light">{label}</p>
                <p className="text-[11px] text-white/25 font-light mt-0.5">{desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
