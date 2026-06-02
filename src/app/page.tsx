import Image from "next/image";
import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import GalleryCarousel from "@/components/GalleryCarousel";
import { prisma } from "@/lib/prisma";
import {
  Heart,
  ArrowRight,
  MessageCircle,
  Home,
  FlaskConical,
  Droplets,
  Cross,
  Building2,
  Baby,
  Activity,
} from "lucide-react";

// ── static data ──────────────────────────────────────────────────────────────

const especialidades = [
  "Cardiología",
  "Cirugía cardiovascular",
  "Clínica Médica",
  "Gastroenterología clínica",
  "Ginecología",
  "Infectología",
  "Nefrología",
  "Nefrología pediátrica",
  "Neurología",
  "Neumonología",
  "Especialidades pediátricas",
  "Traumatología",
  "Urología",
  "Cirugía general",
  "Cirugía Torácica",
  "Cirugía plástica",
  "Gastroenterología endoscópica",
  "Hepatología",
  "Endocrinología",
  "Oncología",
  "Psicología",
  "Nutrición",
];

const novedades = [
  {
    img: "/images/1.jpeg",
    date: "30 abr 2026",
    title: "Nos pintamos de verde: cuidar el planeta también significa cuidar la salud",
  },
  {
    img: "/images/2.jpeg",
    date: "6 nov 2023",
    title: "En el Centro Médico MIT, sede Las Acacias, funcionarán nuevos consultorios.",
  },
  {
    img: "/images/3.jpeg",
    date: "15 mar 2025",
    title: "Nuevas tecnologías de diagnóstico incorporadas en el Sanatorio Central",
  },
  {
    img: "/images/5.jpeg",
    date: "22 ene 2025",
    title: "MIT suma equipo especializado en trasplante renal",
  },
  {
    img: "/images/6.jpeg",
    date: "10 dic 2024",
    title: "Campaña de prevención cardiovascular en la región del Litoral",
  },
  {
    img: "/images/7.jpeg",
    date: "5 oct 2024",
    title: "MIT presente en el Congreso Nacional de Nefrología 2024",
  },
];

const centros = [
  { Icon: Home, nombre: "Sanatorio Central", dir: "Av Freyre 3074" },
  { Icon: Heart, nombre: "Consultorios Mit.", dir: "Av Freyre 3155" },
  { Icon: FlaskConical, nombre: "Centro de Imágenes y Laboratorio", dir: "Av Freyre 3165" },
  { Icon: Droplets, nombre: "Unidad de Diálisis Peritoneal", dir: "Av Freyre 2987" },
  { Icon: Cross, nombre: "Unidad de Trasplante", dir: "Av Freyre 3062" },
  { Icon: Building2, nombre: "Administración Central", dir: "Av Freyre 3106" },
  { Icon: Baby, nombre: "IEP — Especialidades Pediátricas", dir: "Salvador Caputto 3471" },
  { Icon: Building2, nombre: "Centro Médico Las Acacias", dir: "Aut Santa Fe Rosario Km 157" },
  { Icon: Activity, nombre: "Centro Médico de Kinesiología", dir: "" },
];

// ── helpers ──────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium tracking-[0.2em] uppercase text-mit-teal mb-2">
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-8">
      {children}
    </h2>
  );
}

// ── page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const novedades = await prisma.novedad.findMany({
    where: { publicado: true },
    orderBy: [{ destacada: "desc" }, { createdAt: "desc" }],
    take: 3,
    include: { categoria: true },
  });

  return (
    <>
      <HeroSlider />

      {/* Quick links bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 text-white divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
          <Link
            href="/especialidades"
            className="group flex items-center gap-2.5 px-6 py-4 bg-mit-purple hover:bg-[#4a2270] transition-colors duration-300"
          >
            <Heart size={18} strokeWidth={1.5} className="flex-shrink-0 opacity-80" />
            <span className="text-xs font-light leading-tight tracking-wider">
              Tratamientos<br />
              <span className="font-medium">Médicos</span>
            </span>
          </Link>

          <Link
            href="/staff"
            className="bg-[#2a2a2a] flex items-center justify-between px-6 py-4 hover:bg-[#333] transition-colors duration-300 group"
          >
            <span className="text-xs font-light tracking-wider text-white/85 group-hover:text-white transition-colors">
              Staff médico
            </span>
            <ArrowRight size={14} strokeWidth={1.5} className="text-white/30 group-hover:text-mit-teal group-hover:translate-x-0.5 transition-all duration-300" />
          </Link>

          <Link
            href="/contacto"
            className="flex items-center justify-between px-6 py-4 bg-mit-purple hover:bg-[#4a2270] transition-colors duration-300 group"
          >
            <span className="text-xs font-light tracking-wider text-white/90 group-hover:text-white transition-colors">
              Centro único de contacto
            </span>
            <ArrowRight size={14} strokeWidth={1.5} className="text-white/50 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
          </Link>

          <a
            href="https://wa.me/5434245372622"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-6 py-4 bg-mit-teal hover:bg-mit-teal-dark transition-colors duration-300"
          >
            <MessageCircle size={18} strokeWidth={1.5} className="flex-shrink-0 opacity-80" />
            <div>
              <p className="text-[10px] font-light text-white/75 tracking-wider">Whatsapp</p>
              <p className="text-xs font-medium tracking-wide">+54 342 4 537262</p>
            </div>
          </a>
      </div>

      {/* La Clínica */}
      <section className="max-w-6xl mx-auto px-6 py-10 md:py-20 grid md:grid-cols-2 gap-8 md:gap-16 items-center">
        <div>
          <SectionLabel>Quiénes somos</SectionLabel>
          <SectionTitle>La Clínica</SectionTitle>
          <p className="text-mit-teal font-medium text-base leading-relaxed mb-5 border-l-2 border-mit-teal pl-4">
            Desde hace 20 años somos el centro más importante del Litoral y segundo
            centro de trasplante renal en Argentina.
          </p>
          <p className="text-gray-500 text-sm font-light leading-relaxed mb-4">
            Clínica de Especialidades Médicas, líder y referente en la Región, en constante
            evolución a través de la incorporación de técnicas de Diagnóstico y Tratamiento,
            permaneciendo en la avanzada de los Trasplantes de Órganos y las Prácticas de Alta
            Complejidad.
          </p>
          <p className="text-gray-500 text-sm font-light leading-relaxed mb-8">
            <span className="text-mit-teal font-medium">Nuestra visión — </span>
            Ser una Institución Médica que brinda servicios de Salud de alta calidad, con
            asistencia, docencia e investigación, en un ámbito de respeto y compromiso con el
            paciente y su familia.
          </p>
          <Link
            href="/institucional"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-300 px-5 py-2.5 rounded-full hover:border-mit-teal hover:text-mit-teal transition-all duration-300 group"
          >
            Conocer más
            <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-0.5 transition-transform duration-300" />
          </Link>
        </div>
        <div className="relative h-80 md:h-[420px] rounded-lg overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
          <Image
            src="/images/fachada.jpg"
            alt="Sanatorio Central MIT"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Especialidades */}
      <section className="bg-mit-teal py-16">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-white/60 mb-2">
            Atención médica
          </p>
          <h2 className="text-2xl md:text-3xl font-light text-white mb-8">
            Nuestras especialidades
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3 mb-10">
            {especialidades.map((e) => (
              <p key={e} className="text-sm text-white/85 font-light flex items-center gap-2.5 py-1 border-b border-white/10">
                <span className="w-1 h-1 rounded-full bg-white/60 flex-shrink-0" />
                {e}
              </p>
            ))}
          </div>
          <Link
            href="/centros"
            className="inline-flex items-center gap-2 text-sm font-medium text-white border border-white/40 px-5 py-2.5 rounded-full hover:bg-white hover:text-mit-teal transition-all duration-300 group"
          >
            Ir a Sanatorio Central
            <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-0.5 transition-transform duration-300" />
          </Link>
        </div>
      </section>

      {/* Novedades */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <SectionLabel>Noticias</SectionLabel>
            <h2 className="text-2xl md:text-3xl font-light text-gray-800">Últimas novedades</h2>
          </div>
          <Link href="/novedades" className="text-xs text-mit-teal font-medium hover:underline flex items-center gap-1">
            Ver todas <ArrowRight size={11} strokeWidth={2} />
          </Link>
        </div>
        {novedades.length === 0 ? (
          <p className="text-gray-400 text-sm font-light text-center py-12">Próximamente novedades.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {novedades.map((n) => (
              <Link
                key={n.id}
                href={`/novedades/${n.slug}`}
                className="group bg-white rounded-lg overflow-hidden shadow-[0_1px_6px_rgba(0,0,0,0.07)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="relative h-48 overflow-hidden bg-gray-50">
                  {n.imagenDestacada
                    ? <Image src={n.imagenDestacada} alt={n.titulo} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full bg-gradient-to-br from-mit-teal/10 to-mit-purple/10" />
                  }
                  {n.categoria && (
                    <span className="absolute top-3 left-3 text-[9px] font-medium px-2 py-0.5 rounded-full text-white" style={{ background: n.categoria.color }}>
                      {n.categoria.nombre}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs text-gray-400 font-light tracking-wide mb-2">
                    {new Date(n.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  <h3 className="text-sm font-medium text-gray-700 leading-snug line-clamp-2">{n.titulo}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Centros */}
      <section className="bg-gray-50/70 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <SectionLabel>Ubicaciones</SectionLabel>
          <SectionTitle>Nuestros centros</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {centros.map((c) => (
              <div
                key={c.nombre}
                className="group bg-mit-teal text-white rounded-lg p-7 flex flex-col items-center text-center gap-4 hover:bg-mit-teal-dark hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <c.Icon size={32} strokeWidth={1.25} className="opacity-90" />
                <div>
                  <p className="font-medium text-sm leading-snug">{c.nombre}</p>
                  {c.dir && <p className="text-xs text-white/65 mt-1.5 font-light">{c.dir}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galería */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <SectionLabel>Galería</SectionLabel>
          <SectionTitle>Nuestras instalaciones</SectionTitle>
        </div>
        <div className="max-w-6xl mx-auto px-6">
          <GalleryCarousel />
        </div>
      </section>
    </>
  );
}
