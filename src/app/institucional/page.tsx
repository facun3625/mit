import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import GalleryCarousel from "@/components/GalleryCarousel";

// ── data ─────────────────────────────────────────────────────────────────────

const stats = [
  { valor: "1.100+", label: "Trasplantes renales exitosos" },
  { valor: "500+", label: "Cirugías cardíacas" },
  { valor: "9.000+", label: "Intervenciones endovasculares" },
  { valor: "45+", label: "Años de trayectoria" },
];

const valores = [
  "Respeto por la Vida",
  "Solidaridad Social",
  "Compromiso Personal",
  "Trabajo en Equipo",
  "Capacitación Continua",
  "Saber Compartido",
  "Cordialidad Laboral",
];

const historia = [
  {
    año: "1978",
    titulo: "Fundación",
    texto: "El Grupo MIT de la Ciudad de Santa Fe inicia sus actividades con el claro objetivo de brindar servicios de alta complejidad en la región. Comienza desde la Nefrología Clínica, con tratamiento de Insuficiencia Renal Aguda mediante Diálisis Peritoneal e Hemodiálisis, extendiendo sus servicios a Rafaela y Reconquista.",
  },
  {
    año: "1981",
    titulo: "Primer Laboratorio de Histocompatibilidad",
    texto: "Se inaugura en las nuevas instalaciones de Av. Freyre 3074, habilitando áreas de Internación y Cirugía. La integración avanza hacia la promoción de la donación y trasplante de órganos. En 1983, la Clínica colabora con la creación del CUDAIO (Centro Único de Ablación e Implante de Órganos) de la Provincia de Santa Fe.",
  },
  {
    año: "1986",
    titulo: "Pioneros en Trasplante Renal",
    texto: "En diciembre se realiza el Primer Trasplante Renal con Donante Vivo y días después el Primer Trasplante Renal con Donante Cadavérico, convirtiendo a la Institución en pionera de la Cirugía de Trasplantes a nivel regional y nacional.",
  },
  {
    año: "1989",
    titulo: "Servicio de Cardiología",
    texto: "Se incorpora la Unidad Coronaria, asociando el Dpto. de Hemodinamia e Intervencionismo Endovascular y el Dpto. de Cirugía Cardiovascular a la atención de sus pacientes.",
  },
  {
    año: "1995",
    titulo: "Centro Formador de Especialistas",
    texto: "El Colegio de Médicos de Santa Fe habilita a la Institución como Centro Formador. Se inicia la primera Residencia Médica en Nefrología avalada por la Sociedad Argentina de Nefrología. En 1999 se incorporan las Residencias de Urología y Cardiología. Ese mismo año se integra el Instituto de Especialidades Pediátricas (IEP).",
  },
  {
    año: "2000",
    titulo: "Cirugía de Alta Complejidad",
    texto: "Se incorpora el Grupo Especializado del Aparato Digestivo (GEAD). La Cirugía Videolaparoscópica y la Videoendoscopía diagnóstica y terapéutica fueron pilares de este crecimiento. Neurocirugía y Traumatología de Alta Complejidad completan la proyección quirúrgica.",
  },
  {
    año: "2001 – 2011",
    titulo: "Programa de Trasplantes",
    texto: "En 2001 se habilita el Programa de Trasplante Cardíaco. En 2011 se crea la Unidad de Hepatología y el Programa de Trasplante Hepático. Hoy, en asociación con Diaverum Internacional, se asiste a 130 pacientes en Hemodiálisis y 20 en Diálisis Peritoneal Ambulatorio.",
  },
  {
    año: "Hoy",
    titulo: "Líderes del Litoral",
    texto: "Más de 5.000 Cirugías y Procedimientos Endourológicos, 6.000 Videolaparoscopías y 10.000 Videoendoscopías Digestivas. Trascendemos en la región a través del reconocimiento de nuestros resultados y nuestra esmerada dedicación al paciente.",
  },
];


// ── page ─────────────────────────────────────────────────────────────────────

export default function InstitucionalPage() {
  return (
    <>
      {/* Hero teal */}
      <section className="bg-mit-teal text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/[0.05] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full bg-white/[0.04] translate-y-1/2 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-6 relative">
          {/* Línea 1: volver + título */}
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-white/60 text-xs font-light tracking-wide hover:text-white transition-colors"
            >
              <ArrowLeft size={13} strokeWidth={1.5} />
              Volver al inicio
            </Link>
            <div className="text-right">
              <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-white/55 mb-0.5">Quiénes somos</p>
              <h1 className="text-2xl md:text-3xl font-light leading-none">Institucional</h1>
            </div>
          </div>

          {/* Separador */}
          <div className="border-t border-white/15 mb-4" />

          {/* Línea 2: números */}
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

      {/* Intro + Valores */}
      <section className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-10 items-start">
        <div>
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-mit-teal mb-3">
            Nuestra misión
          </p>
          <h2 className="text-2xl md:text-3xl font-light text-gray-800 leading-snug mb-6">
            Desde hace 20 años somos el centro más importante del Litoral y segundo centro de trasplante renal en Argentina.
          </h2>
          <p className="text-sm text-gray-500 font-light leading-relaxed mb-4">
            Clínica de Especialidades Médicas, líder y referente en la Región, en constante evolución a través de la incorporación de técnicas de Diagnóstico y Tratamiento y permaneciendo en la avanzada de los Trasplantes de Órganos y las Prácticas de Alta Complejidad.
          </p>
          <p className="text-sm text-gray-500 font-light leading-relaxed">
            Alcanzar la excelencia profesional, mediante la capacitación y formación continua del recurso humano en el área asistencial y académica.
          </p>
        </div>

        {/* Valores */}
        <div className="bg-[#5f2c82] rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/[0.04] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-mit-teal mb-6">
            Nuestros valores
          </p>
          <ul className="space-y-3">
            {valores.map((v) => (
              <li key={v} className="flex items-center gap-3">
                <CheckCircle2 size={15} strokeWidth={1.5} className="text-mit-teal flex-shrink-0" />
                <span className="text-sm font-light text-white/85">{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Historia — Timeline */}
      <section className="bg-gray-50/70 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-mit-teal mb-2">
            Nuestra trayectoria
          </p>
          <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-8">
            Historia del Grupo MIT
          </h2>

          <div className="relative">
            {/* Línea vertical */}
            <div className="absolute left-[88px] top-0 bottom-0 w-px bg-gradient-to-b from-mit-teal via-[#5f2c82]/30 to-transparent hidden md:block" />

            <div className="space-y-5">
              {historia.map((h, i) => (
                <div key={h.año} className="flex gap-8 items-start group">
                  {/* Año */}
                  <div className="hidden md:flex flex-col items-end min-w-[80px] pt-1">
                    <span className={`text-xs font-semibold tracking-wide ${i % 2 === 0 ? "text-mit-teal" : "text-[#5f2c82]"}`}>
                      {h.año}
                    </span>
                  </div>

                  {/* Dot */}
                  <div className={`hidden md:flex w-4 h-4 rounded-full border-2 flex-shrink-0 mt-1 relative z-10 ${i % 2 === 0 ? "border-mit-teal bg-white" : "border-[#5f2c82] bg-white"}`} />

                  {/* Content */}
                  <div className="flex-1 bg-white rounded-xl p-6 shadow-[0_1px_8px_rgba(0,0,0,0.05)] group-hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-shadow duration-300">
                    <span className={`md:hidden inline-block text-xs font-semibold tracking-wide mb-2 ${i % 2 === 0 ? "text-mit-teal" : "text-[#5f2c82]"}`}>
                      {h.año}
                    </span>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">{h.titulo}</h3>
                    <p className="text-sm text-gray-500 font-light leading-relaxed">{h.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Galería */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-mit-teal mb-2">
            Nuestras instalaciones
          </p>
          <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-6">
            Galería
          </h2>
          <GalleryCarousel />
        </div>
      </section>
    </>
  );
}
