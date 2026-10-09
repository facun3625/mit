import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import GalleryCarousel from "@/components/GalleryCarousel";

// ── data ─────────────────────────────────────────────────────────────────────

const especialidades = [
  "Cardiología", "Cirugía cardiovascular", "Clínica Médica",
  "Gastroenterología clínica", "Ginecología", "Infectología",
  "Nefrología", "Nefrología pediátrico", "Neurología", "Neumonología",
  "Especialidades pediátricas", "Traumatología", "Urología",
  "Cirugía general", "Cirugía Torácica", "Cirugía plástica",
  "Gastroenterología endoscópica", "Hepatología", "Endocrinología",
  "Oncología", "Psicología", "Nutrición",
];

const programas = [
  "Obesidad y cirugía bariátrica", "Diabetes", "Insuficiencia cardíaca",
  "Rehabilitación Cardiopulmonar", "Pre competitivo / Apto médico",
  "Salud Hepática", "Traumatología", "Deportología",
];

// ── sub-components ────────────────────────────────────────────────────────────

function SectionTag({ children, purple }: { children: React.ReactNode; purple?: boolean }) {
  return (
    <span
      className={`inline-block text-[10px] font-semibold tracking-[0.2em] uppercase px-3 py-1 rounded-full mb-4 ${
        purple ? "bg-[#5f2c82] text-white" : "bg-mit-teal text-white"
      }`}
    >
      {children}
    </span>
  );
}

function ListItem({ text, purple }: { text: string; purple?: boolean }) {
  return (
    <li className="flex items-start gap-2">
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${purple ? "bg-[#5f2c82]" : "bg-mit-teal"}`} />
      <span className="text-sm text-gray-600 font-light leading-snug">{text}</span>
    </li>
  );
}

// ── page ─────────────────────────────────────────────────────────────────────

export default function ConsultoriosPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-mit-teal text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/[0.05] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full bg-white/[0.04] translate-y-1/2 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-6 relative">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/centros"
              className="inline-flex items-center gap-1.5 text-white/60 text-xs font-light tracking-wide hover:text-white transition-colors"
            >
              <ArrowLeft size={13} strokeWidth={1.5} />
              Centros Médicos
            </Link>
            <div className="text-right">
              <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-white/55 mb-0.5">Consultas ambulatorias</p>
              <h1 className="text-2xl md:text-3xl font-light leading-none">Consultorios MIT</h1>
            </div>
          </div>
          <div className="border-t border-white/15 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { valor: "22", label: "Especialidades" },
              { valor: "8", label: "Programas" },
              { valor: "2", label: "Sedes" },
              { valor: "Av. Freyre", label: "3155 · Santa Fe" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-xl font-light tracking-tight text-white">{s.valor}</p>
                <p className="text-[10px] font-light text-white/60 tracking-wide leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Especialidades + Programas */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Listas */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-8 shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
              <SectionTag purple>Especialidades</SectionTag>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
                {especialidades.map((e) => <ListItem key={e} text={e} purple />)}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
              <SectionTag>Programas</SectionTag>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
                {programas.map((p) => <ListItem key={p} text={p} />)}
              </ul>
            </div>
          </div>

          {/* Imagen */}
          <div className="relative h-full min-h-[420px] rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.1)] sticky top-24">
            <Image src="/images/2.jpeg" alt="Consultorios MIT" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="text-white text-sm font-medium">Consultorios MIT</p>
              <p className="text-white/60 text-xs font-light">Av. Freyre 3155 · Santa Fe</p>
            </div>
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
