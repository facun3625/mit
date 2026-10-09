import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import GalleryCarousel from "@/components/GalleryCarousel";

// ── data ─────────────────────────────────────────────────────────────────────

const especialidades = [
  "Cardiología | Oncocardiología", "Cirugía General", "Cirugía Plástica",
  "Clínica Médica", "Gastroenterología", "Ginecología", "Neurología",
  "Neumonología", "Nutrición", "Pediatría | Adolescencia",
  "Pre-quirúrgicos", "Traumatología", "Urología adultos y pediátricos",
];

const imagenes = [
  "Ecografía General", "Ecografía Doppler", "Ecocardiograma Stress",
];

const kinesio = [
  "Rehabilitación Traumatológica", "Rehabilitación Cardiorrespiratoria",
  "Rehabilitación Pediátrica", "Neurorrehabilitación", "Terapia ocupacional",
];

// ── sub-components ────────────────────────────────────────────────────────────

function SectionTag({ children, purple }: { children: React.ReactNode; purple?: boolean }) {
  return (
    <span className={`inline-block text-[10px] font-semibold tracking-[0.2em] uppercase px-3 py-1 rounded-full mb-4 ${
      purple ? "bg-[#5f2c82] text-white" : "bg-mit-teal text-white"
    }`}>
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

export default function LasAcaciasPage() {
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
              <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-white/55 mb-0.5">Zona de countries</p>
              <h1 className="text-2xl md:text-3xl font-light leading-none">Centro Médico Las Acacias</h1>
            </div>
          </div>
          <div className="border-t border-white/15 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { valor: "30+", label: "Profesionales" },
              { valor: "13", label: "Especialidades" },
              { valor: "4", label: "Servicios" },
              { valor: "Km 157", label: "Autopista SF-Rosario" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-xl font-light tracking-tight text-white">{s.valor}</p>
                <p className="text-[10px] font-light text-white/60 tracking-wide leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro + Video */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-400 font-light mb-5">
              <MapPin size={12} strokeWidth={1.5} className="text-mit-teal" />
              Autopista Santa Fe–Rosario Km 157
            </div>
            <p className="text-sm text-gray-500 font-light leading-relaxed mb-4">
              La institución brindará servicios de calidad médica de excelencia con más de 30 profesionales,
              en una de las zonas de mayor crecimiento de la región.
            </p>
            <p className="text-sm text-gray-500 font-light leading-relaxed">
              <span className="text-gray-700 font-medium">En el Centro Médico MIT, sede Las Acacias funcionarán consultorios</span>{" "}
              de especialidades médicas generales y pediátricas, servicio de Imágenes con ecografías y doppler,
              kinesiología y laboratorio.
            </p>
          </div>

          {/* Video — reemplazá VIDEO_URL con la URL real */}
          <div className="relative rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.1)] aspect-video bg-gray-900">
            <video
              src="/Acacias-Drome-1.mp4"
              controls
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Especialidades */}
      <section className="bg-gray-50/70 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="bg-white rounded-xl p-8 shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#5f2c82] mb-1">Centro Médico Las Acacias</p>
              <SectionTag purple>Especialidades</SectionTag>
              <ul className="space-y-2">
                {especialidades.map((e) => <ListItem key={e} text={e} purple />)}
              </ul>
            </div>
            <div className="relative h-80 rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
              <Image src="/images/2.jpeg" alt="Centro Médico Las Acacias" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Imágenes */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="relative h-72 rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
            <Image src="/images/5.jpeg" alt="Imágenes Las Acacias" fill className="object-cover" />
          </div>
          <div className="bg-white rounded-xl p-8 shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-mit-teal mb-1">Diagnóstico</p>
            <SectionTag>Centro Médico Las Acacias · Imágenes</SectionTag>
            <ul className="space-y-2">
              {imagenes.map((e) => <ListItem key={e} text={e} />)}
            </ul>
          </div>
        </div>
      </section>

      {/* Laboratorio */}
      <section className="bg-gray-50/70 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="bg-white rounded-xl p-8 shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#5f2c82] mb-1">Análisis clínicos</p>
              <SectionTag purple>Centro Médico Las Acacias · Laboratorio</SectionTag>

              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">Extracciones</p>
                  <ul className="space-y-1.5">
                    <ListItem text="Lunes a Viernes 06:30 a 11:00 hs" purple />
                    <ListItem text="Sábados 08:00 a 11:00 hs" purple />
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">Consultas</p>
                  <ul className="space-y-1.5">
                    <ListItem text="Lunes a Viernes 6:30 a 20 hs" purple />
                  </ul>
                </div>
              </div>
            </div>
            <div className="relative h-72 rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
              <Image src="/images/6.jpeg" alt="Laboratorio Las Acacias" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Kinesiología */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="relative h-72 rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
            <Image src="/images/7.jpeg" alt="Kinesiología Las Acacias" fill className="object-cover" />
          </div>
          <div className="bg-white rounded-xl p-8 shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-mit-teal mb-1">Rehabilitación</p>
            <SectionTag>Centro Médico Las Acacias · Kinesiología</SectionTag>
            <ul className="space-y-2">
              {kinesio.map((e) => <ListItem key={e} text={e} />)}
            </ul>
          </div>
        </div>
      </section>

      {/* Galería */}
      <section className="bg-gray-50/70 py-10">
        <div className="max-w-6xl mx-auto px-6 mb-6">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-mit-teal mb-2">Las Acacias</p>
          <h2 className="text-2xl md:text-3xl font-light text-gray-800">Galería</h2>
        </div>
        <div className="max-w-6xl mx-auto px-6">
          <GalleryCarousel />
        </div>
      </section>
    </>
  );
}
