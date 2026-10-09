import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import GalleryCarousel from "@/components/GalleryCarousel";

// ── data ─────────────────────────────────────────────────────────────────────

const transplante = ["Renal", "Cardíaca", "Hepático"];

const cirugia = [
  "Abdominal", "Urología", "Tórax", "Oncológica", "Hepatobiliar",
  "Cardiovascular", "Neurocirugía", "Traumatología", "Reconstructiva",
];

const cuidadosCriticos = [
  "18 camas críticas", "10 respiradores", "2 camas aislamiento",
  "Monitoreo multiparamétrico y telemetría", "SLEED · Diálisis",
  "Hemoperfusión", "Plasmaféresis", "CPFA", "ECMO", "Balón contrapulsación",
];

const imagenesServicios = [
  "Tomografía computada multislice",
  "Ecografía general",
  "Ecografía doppler",
  "Ecocardiograma stress",
  "Elastografía por fibroscan",
  "Radiografía",
  "Intervencionismo guiado por imágenes (punciones · drenajes · bloqueos)",
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
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${purple ? "bg-[#5f2c82]" : "bg-mit-teal"}`}
      />
      <span className="text-sm text-gray-600 font-light leading-snug">{text}</span>
    </li>
  );
}

// ── page ─────────────────────────────────────────────────────────────────────

export default function CentrosMedicosPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-mit-teal text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/[0.05] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full bg-white/[0.04] translate-y-1/2 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-6 relative">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-white/60 text-xs font-light tracking-wide hover:text-white transition-colors"
            >
              <ArrowLeft size={13} strokeWidth={1.5} />
              Volver al inicio
            </Link>
            <div className="text-right">
              <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-white/55 mb-0.5">Sede principal</p>
              <h1 className="text-2xl md:text-3xl font-light leading-none">Sanatorio Central</h1>
            </div>
          </div>
          <div className="border-t border-white/15 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { valor: "4.000 m²", label: "Sanatorio Central" },
              { valor: "4 plantas", label: "Estructura edilicia" },
              { valor: "18 camas", label: "Cuidados críticos" },
              { valor: "9+", label: "Centros y unidades" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-xl font-light tracking-tight text-white">{s.valor}</p>
                <p className="text-[10px] font-light text-white/60 tracking-wide leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sanatorio Central ── */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-xs font-medium tracking-[0.2em] uppercase text-mit-teal mb-2">Sede principal</p>
        <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-10">Sanatorio Central</h2>

        {/* Descripción + imagen quirófano */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-10">
          <div>
            <p className="text-sm text-gray-500 font-light leading-relaxed mb-5">
              Completamente renovado en sus accesos y fachadas, cuenta con suites de internación,
              sector de internación de corta estadía, quirófanos, áreas críticas de terapia intensiva,
              unidad coronaria y hemodinamia, entre otros. El Sanatorio Central cuenta con 4000 m²
              distribuidos en 4 plantas.
            </p>
            <p className="text-sm text-gray-500 font-light leading-relaxed">
              Hoy, la cantidad y calidad de servicios y especialidades crecieron exponencialmente,
              logrando posicionarse a la vanguardia en alta complejidad médica y el trabajo
              profesional interdisciplinario.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs text-gray-400 font-light">
              <span className="w-5 h-px bg-mit-teal/50" />
              Av. Freyre 3074 · Santa Fe
            </div>
          </div>
          <div className="relative h-72 md:h-80 rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
            <Image
              src="/images/slider.jpg"
              alt="Sanatorio Central MIT"
              fill
              className="object-cover"
            />
          </div>
        </div>

      </section>

      {/* ── Alta Complejidad ── */}
      <section className="bg-gray-50/70 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-mit-teal mb-2">Sanatorio Central</p>
          <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-10">Medicina de Alta Complejidad</h2>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Foto fachada MIT */}
            <div className="relative h-full min-h-[320px] rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
              <Image src="/images/1.jpeg" alt="Grupo MIT" fill className="object-cover" />
            </div>

            {/* Columnas de servicios */}
            <div className="grid grid-cols-2 gap-6">
              {/* Transplante */}
              <div className="bg-white rounded-xl p-6 shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
                <SectionTag purple>Trasplante</SectionTag>
                <ul className="space-y-2">
                  {transplante.map((t) => <ListItem key={t} text={t} purple />)}
                </ul>
              </div>

              {/* Cuidados Críticos */}
              <div className="bg-white rounded-xl p-6 shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
                <SectionTag>Cuidados Críticos</SectionTag>
                <ul className="space-y-2">
                  {cuidadosCriticos.map((c) => <ListItem key={c} text={c} />)}
                </ul>
              </div>

              {/* Cirugía — full width */}
              <div className="col-span-2 bg-white rounded-xl p-6 shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
                <SectionTag purple>Cirugía</SectionTag>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {cirugia.map((c) => <ListItem key={c} text={c} purple />)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Imágenes y Laboratorio ── */}
      <section className="bg-gray-50/70 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-mit-teal mb-2">Diagnóstico avanzado</p>
          <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-10">Imágenes y Laboratorio</h2>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Imágenes */}
            <div>
              <div className="bg-white rounded-xl p-8 shadow-[0_1px_8px_rgba(0,0,0,0.05)] mb-6">
                <SectionTag>Servicio de Imágenes de Alta Complejidad</SectionTag>
                <p className="text-sm text-gray-500 font-light leading-relaxed mb-5">
                  Calidad profesional con atención de excelencia y tecnología avanzada, en función
                  de la precisión diagnóstica, para pacientes de Grupo MIT y de otras instituciones
                  o clínicas.
                </p>
                <ul className="space-y-2">
                  {imagenesServicios.map((s) => <ListItem key={s} text={s} />)}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative h-44 rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
                  <Image src="/images/5.jpeg" alt="Tomografía MIT" fill className="object-cover" />
                </div>
                <div className="relative h-44 rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
                  <Image src="/images/6.jpeg" alt="Ecografía MIT" fill className="object-cover" />
                </div>
              </div>
            </div>

            {/* Laboratorio */}
            <div>
              <div className="relative h-56 rounded-xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.08)] mb-6">
                <Image src="/images/3.jpeg" alt="Laboratorio MIT" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5">
                  <p className="text-white text-sm font-medium">Laboratorio MIT</p>
                  <p className="text-white/60 text-xs font-light">Av. Freyre 3165 · Santa Fe</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
                <SectionTag purple>Laboratorio</SectionTag>
                <p className="text-sm text-gray-500 font-light leading-relaxed mb-4">
                  El nuevo laboratorio de análisis clínicos y microbiológicos brinda atención
                  ambulatoria, servicio en unidad de internación, de trasplantes y de urgencias
                  cardiológicas.
                </p>
                <p className="text-sm text-gray-500 font-light leading-relaxed mb-4">
                  El portal de autogestión, el sistema de gestión integrado y el lab check-in
                  son algunas de las herramientas destinadas a brindar un servicio rápido y
                  eficiente. Laboratorio MIT está conformado por un equipo profesional enfocado
                  en el asesoramiento y respeto por el paciente.
                </p>
                <div className="bg-mit-teal/10 rounded-lg p-4 space-y-1.5">
                  {["Lab check-in", "Turnos online", "Sector para niños"].map((item) => (
                    <p key={item} className="text-sm text-mit-teal font-medium flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-mit-teal" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Unidad de Trasplantes ── */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-xs font-medium tracking-[0.2em] uppercase text-mit-teal mb-2">Referencia regional</p>
        <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-10">Unidad de Trasplantes</h2>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="relative h-80 md:h-[420px] rounded-xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.12)]">
            <Image src="/images/7.jpeg" alt="Unidad de Trasplantes MIT" fill className="object-cover" />
          </div>
          <div>
            <p className="text-mit-teal font-medium text-base leading-relaxed mb-5 border-l-2 border-mit-teal pl-4">
              Grupo MIT es el referente más importante en la región Litoral en Trasplante de
              Órganos, con más de 4 décadas de trayectoria.
            </p>
            <p className="text-sm text-gray-500 font-light leading-relaxed mb-4">
              La accesibilidad a la medicina de alta complejidad es de suma importancia en toda
              comunidad, y como expresión de la misma, el trasplante de órganos es el procedimiento
              que brinda a las personas con enfermedades terminales la recuperación de su calidad
              de vida.
            </p>
            <p className="text-sm text-gray-500 font-light leading-relaxed mb-8">
              Desde hace 20 años somos el centro más importante del Litoral y segundo centro de
              trasplante renal en la Argentina. Los trasplantes hepáticos y cardíacos se realizan
              con un marcado enfoque interdisciplinario y con profesionales en permanente
              capacitación en los más reconocidos centros médicos a nivel mundial.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              {[
                { valor: "1.100+", label: "Trasplantes renales" },
                { valor: "500+", label: "Cirugías cardíacas" },
                { valor: "45+", label: "Años de trayectoria" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-xl font-light text-mit-teal">{s.valor}</p>
                  <p className="text-[10px] text-gray-400 font-light leading-tight mt-0.5">{s.label}</p>
                </div>
              ))}
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
