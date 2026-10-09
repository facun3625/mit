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
        <p className="text-gray-500 text-xs font-light tracking-[0.2em] uppercase mb-1">
          Panel de administración
        </p>
        <h1 className="text-gray-900 text-2xl font-light">Dashboard</h1>
        <p className="text-gray-500 text-xs mt-1">
          Bienvenido, <span className="text-gray-600">{session?.email}</span>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {cards.map(({ label, value, icon: Icon, href, color }) => (
          <a
            key={label}
            href={href}
            className="group bg-white border border-gray-200 rounded-xl p-6 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2 rounded-lg ${color === "teal" ? "bg-mit-teal/10" : "bg-[#5f2c82]/20"}`}>
                <Icon
                  size={18}
                  strokeWidth={1.5}
                  className={color === "teal" ? "text-mit-teal" : "text-mit-purple"}
                />
              </div>
              <Activity size={12} strokeWidth={1.5} className="text-gray-400 group-hover:text-gray-500 transition-colors" />
            </div>
            <p className="text-3xl font-light text-gray-900 mb-1">{value}</p>
            <p className="text-xs text-gray-500 font-light tracking-wide">{label}</p>
          </a>
        ))}
      </div>

      {/* Accesos rápidos */}
      <div>
        <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-gray-500 mb-4">
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
              className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-xl p-5 hover:bg-gray-50 hover:border-mit-teal/20 transition-all duration-300 group"
            >
              <div className="w-9 h-9 rounded-lg bg-mit-teal/10 flex items-center justify-center flex-shrink-0 group-hover:bg-mit-teal/20 transition-colors">
                <Icon size={16} strokeWidth={1.5} className="text-mit-teal" />
              </div>
              <div>
                <p className="text-sm text-gray-800 font-light">{label}</p>
                <p className="text-[11px] text-gray-500 font-light mt-0.5">{desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
