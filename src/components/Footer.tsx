import Image from "next/image";
import { Phone, MessageCircle, MapPin } from "lucide-react";

const centros = [
  { nombre: "Consultorios Mit", dir: "Av Freyre 3155" },
  { nombre: "Imágenes y Laboratorio", dir: "Av Freyre 3165" },
  { nombre: "Administración Central", dir: "Av Freyre 3108" },
  { nombre: "Unidad de Trasplante", dir: "Av Freyre 3062" },
  { nombre: "Diálisis Peritoneal", dir: "Av Freyre 2987" },
  { nombre: "IEP Pediátricas", dir: "Salvador Caputto 3471" },
  { nombre: "Las Acacias", dir: "Aut Santa Fe Rosario Km 157" },
];

export default function Footer() {
  return (
    <footer>
      <div className="bg-[#5f2c82] text-white pt-14 pb-12 relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/[0.03] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-mit-teal/[0.06] translate-y-1/2 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative">
          {/* Logo + divider */}
          <div className="flex items-center justify-between mb-10 pb-8 border-b border-white/10">
            <Image
              src="/images/mit_logo.svg"
              alt="Grupo MIT"
              width={160}
              height={68}
              className="brightness-0 invert opacity-85"
            />
            <div className="hidden md:flex items-center gap-1.5 text-white/40 text-xs font-light tracking-widest">
              <span className="w-6 h-px bg-mit-teal/60" />
              Salud · Excelencia · Compromiso
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Col 1 — Sede */}
            <div>
              <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-mit-teal/80 mb-5">
                Sede Principal
              </h3>
              <div className="flex items-start gap-2.5 mb-3">
                <MapPin size={13} strokeWidth={1.5} className="text-mit-teal mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white leading-tight">Sanatorio Central</p>
                  <p className="text-xs text-white/50 font-light mt-0.5">Av Freyre 3074, Santa Fe</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 mt-4">
                <Phone size={13} strokeWidth={1.5} className="text-mit-teal flex-shrink-0" />
                <p className="text-xs text-white/50 font-light">54 342 4 537262</p>
              </div>
            </div>

            {/* Col 2 — Centros */}
            <div>
              <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-mit-teal/80 mb-5">
                Centros
              </h3>
              <ul className="space-y-2.5">
                {centros.map((c) => (
                  <li key={c.nombre} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-mit-teal/60 mt-1.5 flex-shrink-0" />
                    <span className="text-xs text-white/55 font-light leading-snug">
                      <span className="text-white/80 font-normal">{c.nombre}</span>
                      <span className="text-white/35 mx-1">·</span>
                      {c.dir}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — Contacto */}
            <div>
              <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-mit-teal/80 mb-5">
                Centro Único de Contacto
              </h3>
              <p className="text-xl font-light tracking-wide text-white/90 mb-1">
                +54 342 4 537262
              </p>
              <p className="text-xs text-white/40 font-light mb-5">Lunes a viernes · 8 a 20 hs</p>
              <a
                href="https://wa.me/5434245372622"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-medium border border-white/20 text-white/70 px-4 py-2.5 rounded-full hover:bg-white/10 hover:border-white/40 hover:text-white transition-all duration-300"
              >
                <MessageCircle size={13} strokeWidth={1.5} />
                Escribinos por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#4a2270] text-white/30 text-[10px] text-center py-4 tracking-widest font-light uppercase">
        © 2025 Grupo MIT — Todos los derechos reservados
      </div>
    </footer>
  );
}
