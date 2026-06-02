import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import GalleryCarousel from "@/components/GalleryCarousel";

const tiposTrasplante = [
  { tipo: "Trasplante Renal", desc: "Más de 1.100 trasplantes realizados. Segundo centro de trasplante renal en Argentina." },
  { tipo: "Trasplante Hepático", desc: "Programa de trasplante hepático con enfoque interdisciplinario y profesionales de alta capacitación." },
  { tipo: "Trasplante Cardíaco", desc: "Habilitado desde 2001. Equipo cardiovascular de excelencia con seguimiento integral del paciente." },
];

const valores = [
  "Más de 4 décadas de trayectoria",
  "Segundo centro de trasplante renal en Argentina",
  "Profesionales en permanente capacitación",
  "Enfoque interdisciplinario",
  "Reconocimiento a nivel nacional e internacional",
  "Colaboración con CUDAIO desde 1983",
];

const stats = [
  { valor: "1.100+", label: "Trasplantes renales" },
  { valor: "4+", label: "Décadas de trayectoria" },
  { valor: "3", label: "Programas activos" },
  { valor: "2°", label: "Centro en Argentina" },
];

export default function TrasplantePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-mit-teal text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/[0.05] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full bg-white/[0.04] translate-y-1/2 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-6 relative">
          <div className="flex items-center justify-between mb-4">
            <Link href="/centros" className="inline-flex items-center gap-1.5 text-white/60 text-xs font-light tracking-wide hover:text-white transition-colors">
              <ArrowLeft size={13} strokeWidth={1.5} />
              Centros Médicos
            </Link>
            <div className="text-right">
              <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-white/55 mb-0.5">Referencia regional</p>
              <h1 className="text-2xl md:text-3xl font-light leading-none">Unidad de Trasplantes</h1>
            </div>
          </div>
          <div className="border-t border-white/15 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-xl font-light tracking-tight text-white">{s.valor}</p>
                <p className="text-[10px] font-light text-white/60 tracking-wide leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="relative h-80 md:h-[440px] rounded-xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.12)]">
            <Image src="/images/7.jpeg" alt="Unidad de Trasplantes MIT" fill className="object-cover" />
          </div>
          <div>
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-mit-teal mb-3">Quiénes somos</p>
            <p className="text-mit-teal font-medium text-base leading-relaxed mb-5 border-l-2 border-mit-teal pl-4">
              Grupo MIT es el referente más importante en la región Litoral en Trasplante de Órganos,
              con más de 4 décadas de trayectoria.
            </p>
            <p className="text-sm text-gray-500 font-light leading-relaxed mb-4">
              La accesibilidad a la medicina de alta complejidad es de suma importancia en toda comunidad,
              y como expresión de la misma, el trasplante de órganos es el procedimiento que brinda a las
              personas con enfermedades terminales la recuperación de su calidad de vida.
            </p>
            <p className="text-sm text-gray-500 font-light leading-relaxed mb-8">
              Desde hace 20 años somos el centro más importante del Litoral y segundo centro de trasplante
              renal en la Argentina. Los trasplantes hepáticos y cardíacos se realizan con un marcado
              enfoque interdisciplinario y con profesionales en permanente capacitación en los más
              reconocidos centros médicos a nivel mundial.
            </p>
          </div>
        </div>
      </section>

      {/* Programas */}
      <section className="bg-gray-50/70 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-mit-teal mb-2">Programas</p>
          <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-8">Tipos de trasplante</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {tiposTrasplante.map((t, i) => (
              <div key={t.tipo} className={`rounded-xl p-7 text-white ${i % 2 === 0 ? "bg-mit-teal" : "bg-[#5f2c82]"}`}>
                <p className="text-xs font-semibold tracking-[0.15em] uppercase text-white/60 mb-2">Programa</p>
                <h3 className="text-lg font-light mb-3">{t.tipo}</h3>
                <p className="text-sm font-light text-white/75 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por qué MIT */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-mit-teal mb-2">Nuestra trayectoria</p>
            <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-6">¿Por qué elegirnos?</h2>
            <p className="text-sm text-gray-500 font-light leading-relaxed mb-5">
              Desde 1986, cuando se realizó el primer Trasplante Renal en la institución, hemos construido
              un programa de trasplantes que hoy nos posiciona como referentes indiscutidos de la región.
              Nuestra colaboración con el CUDAIO (Centro Único de Ablación e Implante de Órganos) desde
              1983 refleja nuestro compromiso con la donación y el trasplante de órganos.
            </p>
          </div>
          <div className="bg-[#5f2c82] rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/[0.04] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-mit-teal mb-5">Nuestras fortalezas</p>
            <ul className="space-y-3">
              {valores.map((v) => (
                <li key={v} className="flex items-center gap-3">
                  <CheckCircle2 size={15} strokeWidth={1.5} className="text-mit-teal flex-shrink-0" />
                  <span className="text-sm font-light text-white/85">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Galería */}
      <section className="bg-gray-50/70 py-10">
        <div className="max-w-6xl mx-auto px-6 mb-6">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-mit-teal mb-2">Nuestras instalaciones</p>
          <h2 className="text-2xl md:text-3xl font-light text-gray-800">Galería</h2>
        </div>
        <div className="max-w-6xl mx-auto px-6">
          <GalleryCarousel />
        </div>
      </section>
    </>
  );
}
