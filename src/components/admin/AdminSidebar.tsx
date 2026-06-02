"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";
import {
  LayoutDashboard,
  Users,
  Newspaper,
  Stethoscope,
  MapPin,
  Upload,
  Building2,
  LogOut,
  ChevronRight,
} from "lucide-react";

const nav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Staff Médico", href: "/admin/staff", icon: Users },
  { label: "Importar médicos", href: "/admin/importar", icon: Upload },
  { label: "Especialidades", href: "/admin/especialidades", icon: Stethoscope },
  { label: "Sedes", href: "/admin/sedes", icon: MapPin },
  { label: "Novedades", href: "/admin/novedades", icon: Newspaper },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-[#0a0a0f] border-r border-white/[0.06] flex flex-col sticky top-0 h-screen">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/[0.06]">
        <Link href="/admin">
          <Image
            src="/images/mit_logo.svg"
            alt="Grupo MIT"
            width={110}
            height={48}
            className="brightness-0 invert opacity-70"
          />
        </Link>
        <p className="text-[9px] font-medium tracking-[0.2em] uppercase text-white/20 mt-2">
          Panel Admin
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ label, href, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-light transition-all duration-200 group
                ${active
                  ? "bg-mit-teal/15 text-mit-teal"
                  : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
                }`}
            >
              <Icon size={16} strokeWidth={1.5} className="flex-shrink-0" />
              <span className="flex-1 tracking-wide">{label}</span>
              {active && <ChevronRight size={12} strokeWidth={1.5} className="opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-6 border-t border-white/[0.06] pt-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-white/25 hover:text-white/50 transition-colors mb-1"
        >
          <Building2 size={14} strokeWidth={1.5} />
          Ver sitio público
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-white/25 hover:text-red-400/70 transition-colors"
          >
            <LogOut size={14} strokeWidth={1.5} />
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
