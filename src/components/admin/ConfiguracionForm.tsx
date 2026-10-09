"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import { updateConfiguracion } from "@/app/actions/config";

export default function ConfiguracionForm({ whatsapp }: { whatsapp: string }) {
  const [state, formAction, pending] = useActionState(updateConfiguracion, null);
  const [saved, setSaved] = useState(false);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending) setSaved(!state?.error);
    wasPending.current = pending;
  }, [pending, state]);

  return (
    <div className="p-8 max-w-2xl w-full">
      <p className="text-gray-500 text-xs font-light tracking-[0.2em] uppercase mb-1">Configuración</p>
      <h1 className="text-gray-900 text-2xl font-light mb-8">Número de WhatsApp</h1>

      <form action={formAction} className="space-y-6">
        <div>
          <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-gray-500 mb-1.5">
            Número
          </label>
          <div className="relative">
            <MessageCircle size={15} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              name="whatsapp"
              defaultValue={whatsapp}
              placeholder="+54 342 4 537262"
              className="w-full bg-white border border-gray-200 rounded-lg pl-11 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-mit-teal/60 transition-all"
            />
          </div>
          <p className="text-gray-500 text-xs font-light mt-2">
            Se usa en el botón flotante, el pie de página y el inicio del sitio. Incluí el código de país.
          </p>
        </div>

        {state?.error && (
          <p className="text-red-600 text-xs py-2.5 px-4 bg-red-500/10 rounded-lg border border-red-500/20">
            {state.error}
          </p>
        )}

        {!state?.error && !pending && saved && (
          <p className="text-mit-teal text-xs py-2.5 px-4 bg-mit-teal/10 rounded-lg border border-mit-teal/20">
            Número actualizado.
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="bg-mit-teal hover:bg-mit-teal-dark disabled:opacity-50 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          {pending ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </div>
  );
}
