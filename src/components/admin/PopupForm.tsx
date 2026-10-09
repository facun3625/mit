"use client";

import { useActionState, useState } from "react";
import { X, CheckCircle2, Eye } from "lucide-react";
import TiptapEditor from "@/components/admin/TiptapEditor";
import { updatePopup } from "@/app/actions/popup";

type Popup = { titulo: string; contenido: string; activo: boolean; frecuencia: string };

export default function PopupForm({ popup, alcanzados }: { popup: Popup | null; alcanzados: number }) {
  const [state, formAction, pending] = useActionState(updatePopup, null);
  const [titulo, setTitulo] = useState(popup?.titulo ?? "");
  const [contenido, setContenido] = useState(popup?.contenido ?? "");
  const [activo, setActivo] = useState(popup?.activo ?? false);
  const [frecuencia, setFrecuencia] = useState(popup?.frecuencia ?? "UNA_VEZ");
  const [preview, setPreview] = useState(false);

  function handleSubmit(fd: FormData) {
    fd.set("titulo", titulo);
    fd.set("contenido", contenido);
    fd.set("activo", String(activo));
    fd.set("frecuencia", frecuencia);
    return formAction(fd);
  }

  const input = "w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-mit-teal focus:ring-2 focus:ring-mit-teal/15 transition-all";
  const label = "block text-[11px] font-medium tracking-[0.12em] uppercase text-gray-500 mb-2";

  return (
    <div className="p-4 sm:p-8 max-w-4xl w-full">
      <p className="text-gray-500 text-xs font-medium tracking-[0.2em] uppercase mb-1">Contenido</p>
      <h1 className="text-gray-900 text-2xl font-light mb-1">Pop-up del inicio</h1>
      <p className="text-gray-500 text-sm font-light mb-8">Un aviso que se muestra sobre la página de inicio cuando alguien ingresa al sitio.</p>

      <form action={handleSubmit} className="space-y-7">
        {/* Estado */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-800">{activo ? "Pop-up activo" : "Pop-up desactivado"}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {activo ? "Se muestra en el inicio del sitio." : "No se muestra a nadie hasta que lo actives."}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={activo}
            onClick={() => setActivo(!activo)}
            className={`relative w-12 h-7 rounded-full transition-colors ${activo ? "bg-mit-teal" : "bg-gray-300"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${activo ? "translate-x-5" : ""}`} />
          </button>
        </div>

        {/* Título */}
        <div>
          <label className={label}>Título</label>
          <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej: Nuevo horario de atención" className={input} />
        </div>

        {/* Contenido */}
        <div>
          <label className={label}>Contenido</label>
          <TiptapEditor
            initialContent={popup?.contenido ?? ""}
            onChange={setContenido}
            placeholder="Escribí el mensaje. Podés usar negrita, colores, enlaces e imágenes…"
            minHeight={200}
            allowVideo={false}
          />
        </div>

        {/* Frecuencia */}
        <div>
          <label className={label}>¿Cada cuánto se muestra?</label>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { v: "UNA_VEZ", t: "Una sola vez por IP", d: "Cada visitante lo ve una vez. Si editás el contenido, vuelve a mostrarse a todos." },
              { v: "SIEMPRE", t: "Cada vez que ingresan", d: "Aparece en cada visita al sitio, aunque sea la misma persona. No se repite al navegar dentro de la misma visita." },
            ].map((o) => (
              <button
                key={o.v}
                type="button"
                onClick={() => setFrecuencia(o.v)}
                className={`text-left rounded-xl border p-4 transition-all ${frecuencia === o.v ? "border-mit-teal bg-mit-teal/5 ring-2 ring-mit-teal/15" : "border-gray-200 bg-white hover:border-gray-300"}`}
              >
                <p className="flex items-center gap-2 text-sm text-gray-800">
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${frecuencia === o.v ? "border-mit-teal" : "border-gray-300"}`}>
                    {frecuencia === o.v && <span className="w-2 h-2 rounded-full bg-mit-teal" />}
                  </span>
                  {o.t}
                </p>
                <p className="text-xs text-gray-500 mt-1.5 ml-6 leading-relaxed">{o.d}</p>
              </button>
            ))}
          </div>
          {frecuencia === "UNA_VEZ" && (
            <p className="text-xs text-gray-500 mt-2">
              Lo vieron <strong className="text-gray-700">{alcanzados}</strong> {alcanzados === 1 ? "IP" : "IPs"} desde la última edición.
              Las personas que comparten una misma conexión (ej. una oficina) cuentan como una sola.
            </p>
          )}
        </div>

        {state?.error && <p className="text-red-600 text-xs py-2.5 px-4 bg-red-50 rounded-lg border border-red-100">{state.error}</p>}
        {state?.ok && !pending && (
          <p className="flex items-center gap-2 text-emerald-700 text-xs py-2.5 px-4 bg-emerald-50 rounded-lg border border-emerald-100">
            <CheckCircle2 size={14} /> Cambios guardados.
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={pending} className="bg-mit-teal hover:bg-mit-teal-dark disabled:opacity-50 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors">
            {pending ? "Guardando..." : "Guardar"}
          </button>
          <button type="button" onClick={() => setPreview(true)} className="flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm px-5 py-2.5 rounded-lg transition-colors">
            <Eye size={15} strokeWidth={1.5} /> Vista previa
          </button>
        </div>
      </form>

      {preview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" onClick={() => setPreview(false)}>
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setPreview(false)} aria-label="Cerrar" className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 text-gray-500 hover:text-gray-900 shadow-sm">
              <X size={16} />
            </button>
            <div className="px-6 sm:px-8 py-8">
              {titulo && <h2 className="text-2xl font-light text-gray-800 leading-snug pr-8 mb-4">{titulo}</h2>}
              <div className="novedad-content" dangerouslySetInnerHTML={{ __html: contenido }} />
              {!titulo && !contenido && <p className="text-sm text-gray-400">El pop-up está vacío.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
