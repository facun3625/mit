"use client";

import { useState } from "react";
import Image from "next/image";
import { UserRound, MapPin, X, Stethoscope, ChevronRight } from "lucide-react";

type Doctor = {
  id: number;
  nombre: string;
  foto: string | null;
  texto: string | null;
  especialidades: { especialidad: { id: number; nombre: string } }[];
  sedes: { sede: { id: number; nombre: string } }[];
};

function DoctorModal({ doc, onClose }: { doc: Doctor; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Foto o fondo degradado */}
        <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-50">
          {doc.foto ? (
            <Image src={doc.foto} alt={doc.nombre} fill className="object-cover object-top" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <UserRound size={72} strokeWidth={0.6} className="text-gray-200" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-500 hover:text-gray-800 rounded-full transition-all shadow-sm"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Info */}
        <div className="px-7 pb-7 -mt-2">
          <h2 className="text-xl font-medium text-gray-800 leading-snug mb-1">{doc.nombre}</h2>

          {/* Especialidades */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {doc.especialidades.map(({ especialidad }) => (
              <span
                key={especialidad.id}
                className="text-[10px] font-medium bg-mit-teal/10 text-mit-teal px-2.5 py-0.5 rounded-full tracking-wide"
              >
                {especialidad.nombre}
              </span>
            ))}
          </div>

          {/* Texto / CV */}
          {doc.texto && (
            <p className="text-sm text-gray-500 font-light leading-relaxed mb-5 border-l-2 border-mit-teal/30 pl-3">
              {doc.texto}
            </p>
          )}

          {/* Sedes */}
          <div className="pt-4 border-t border-gray-100 space-y-1.5">
            <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-gray-300 mb-2 flex items-center gap-1.5">
              <Stethoscope size={10} strokeWidth={1.5} /> Atiende en
            </p>
            {doc.sedes.map(({ sede }) => (
              <div key={sede.id} className="flex items-center gap-2 text-xs text-gray-500 font-light">
                <MapPin size={11} strokeWidth={1.5} className="text-mit-teal flex-shrink-0" />
                {sede.nombre}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StaffGrid({ doctors }: { doctors: Doctor[] }) {
  const [selected, setSelected] = useState<Doctor | null>(null);

  if (doctors.length === 0) {
    return (
      <div className="text-center py-20">
        <UserRound size={48} strokeWidth={1} className="text-gray-200 mx-auto mb-4" />
        <p className="text-gray-400 text-sm font-light">No se encontraron médicos con los filtros seleccionados.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
        {doctors.map((doc) => (
          <button
            key={doc.id}
            onClick={() => setSelected(doc)}
            className="group bg-white hover:bg-gray-50/80 transition-colors duration-200 text-left px-5 py-4 flex items-center gap-4"
          >
            {/* Avatar pequeño */}
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {doc.foto
                ? <Image src={doc.foto} alt={doc.nombre} width={36} height={36} className="object-cover object-top w-full h-full" />
                : <UserRound size={16} strokeWidth={1} className="text-gray-300" />
              }
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 leading-snug truncate">{doc.nombre}</p>
              <p className="text-[10px] text-mit-teal font-light truncate mt-0.5">
                {doc.especialidades[0]?.especialidad.nombre ?? ""}
                {doc.especialidades.length > 1 && ` · +${doc.especialidades.length - 1}`}
              </p>
              {doc.texto && (
                <p className="text-[10px] text-gray-400 font-light truncate mt-0.5">{doc.texto}</p>
              )}
            </div>

            <ChevronRight size={13} strokeWidth={1.5} className="text-gray-200 group-hover:text-mit-teal transition-colors flex-shrink-0" />
          </button>
        ))}
      </div>

      {selected && <DoctorModal doc={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
