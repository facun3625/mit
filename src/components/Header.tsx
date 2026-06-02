"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { MapPin, Phone, Menu, X, ChevronDown } from "lucide-react";
import AdminLoginModal from "@/components/AdminLoginModal";

type NavChild = { label: string; href: string };
type NavLink = { label: string; href: string; children?: NavChild[] };

const navLinks: NavLink[] = [
  { label: "Inicio", href: "/" },
  { label: "Institucional", href: "/institucional" },
  {
    label: "Centros Médicos",
    href: "/centros",
    children: [
      { label: "Sanatorio Central", href: "/centros" },
      { label: "Consultorios MIT", href: "/consultorios" },
      { label: "Centro Médico Las Acacias", href: "/las-acacias" },
      { label: "Unidad de Trasplante", href: "/trasplante" },
    ],
  },
  { label: "Staff Médico", href: "/staff" },
  { label: "Info para el Paciente", href: "/paciente" },
  { label: "Novedades", href: "/novedades" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const pathname = usePathname();

  return (
    <>
    <header className="w-full z-50 sticky top-0 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.06)]">
      {/* Top bar */}
      <div className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-500 font-light tracking-wide">
            <span className="hidden sm:flex items-center gap-1.5">
              <MapPin size={12} className="text-mit-teal" strokeWidth={1.5} />
              Sanatorio Central: Av Freyre 3074
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <Phone size={12} className="text-mit-teal" strokeWidth={1.5} />
              54 342 4 537262
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLoginModal(true)}
              className="hidden sm:block text-xs font-medium tracking-wide text-white bg-mit-purple px-3 py-1.5 rounded-full hover:bg-[#4a2270] transition-colors duration-300"
            >
              Acceso Admin
            </button>
            <a
              href="https://grupomit.com.ar/app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium tracking-wide text-white bg-mit-teal px-3 py-1.5 rounded-full hover:bg-mit-teal-dark transition-colors duration-300"
            >
              <span className="hidden sm:inline">Acceso Proveedores</span>
              <span className="sm:hidden">Proveedores</span>
            </a>
          </div>
        </div>
      </div>

      {/* Logo + Nav */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex-shrink-0">
          <Image src="/images/mit_logo.svg" alt="Grupo MIT" width={140} height={60} priority className="md:w-[190px] md:h-[80px]" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href)) ||
              link.children?.some((c) => pathname === c.href || pathname.startsWith(c.href));

            if (link.children) {
              return (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setHoveredDropdown(link.href)}
                  onMouseLeave={() => setHoveredDropdown(null)}
                >
                  <button
                    className={`flex items-center gap-1 px-4 py-2 text-sm font-medium tracking-wide transition-all duration-200 rounded
                      ${active
                        ? "bg-mit-teal text-white"
                        : "text-gray-600 hover:text-mit-teal hover:bg-mit-teal-light"
                      }`}
                  >
                    {link.label}
                    <ChevronDown
                      size={13}
                      strokeWidth={1.5}
                      className={`transition-transform duration-200 ${hoveredDropdown === link.href ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown panel */}
                  <div
                    className={`absolute top-full left-0 pt-1 transition-all duration-200 ${
                      hoveredDropdown === link.href
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-1 pointer-events-none"
                    }`}
                  >
                    <div className="bg-white rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-gray-100 py-1.5 min-w-[200px] overflow-hidden">
                      {link.children.map((child) => {
                        const childActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block px-4 py-2.5 text-xs font-light tracking-wide transition-colors duration-150
                              ${childActive
                                ? "text-mit-teal bg-mit-teal-light font-medium"
                                : "text-gray-600 hover:text-mit-teal hover:bg-mit-teal-light"
                              }`}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium tracking-wide transition-all duration-200 rounded
                  ${active
                    ? "bg-mit-teal text-white"
                    : "text-gray-600 hover:text-mit-teal hover:bg-mit-teal-light"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-gray-500 hover:text-gray-800 transition-colors p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menú"
        >
          {mobileOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-gray-100 bg-white">
          {navLinks.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href)) ||
              link.children?.some((c) => pathname === c.href);
            const expanded = mobileExpanded === link.href;

            if (link.children) {
              return (
                <div key={link.href} className="border-b border-gray-50">
                  <button
                    className={`w-full flex items-center justify-between px-6 py-3.5 text-sm font-medium transition-colors
                      ${active ? "text-mit-teal bg-mit-teal-light" : "text-gray-600"}`}
                    onClick={() => setMobileExpanded(expanded ? null : link.href)}
                  >
                    {link.label}
                    <ChevronDown
                      size={14}
                      strokeWidth={1.5}
                      className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expanded && (
                    <div className="bg-gray-50/60 border-t border-gray-100">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block pl-10 pr-6 py-3 text-xs font-light tracking-wide transition-colors border-b border-gray-100/60
                            ${pathname === child.href ? "text-mit-teal font-medium" : "text-gray-500 hover:text-mit-teal"}`}
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-6 py-3.5 text-sm font-medium transition-colors border-b border-gray-50
                  ${active ? "text-mit-teal bg-mit-teal-light" : "text-gray-600 hover:text-mit-teal hover:bg-mit-teal-light"}`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>

    {showLoginModal && <AdminLoginModal onClose={() => setShowLoginModal(false)} />}
  </>
  );
}
