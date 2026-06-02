"use client";

import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { deleteDoctor } from "@/app/actions/staff";

export default function DeleteDoctorButton({ id, nombre }: { id: number; nombre: string }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      {confirming && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0f0f14] border border-white/[0.1] rounded-2xl p-7 w-full max-w-xs shadow-2xl">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/10 mb-5 mx-auto">
              <AlertTriangle size={18} strokeWidth={1.5} className="text-red-400" />
            </div>
            <p className="text-white text-sm font-light text-center mb-1">¿Eliminar médico?</p>
            <p className="text-white/40 text-xs font-light text-center mb-6">
              <span className="text-white/70">"{nombre}"</span> será eliminado permanentemente.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirming(false)}
                className="flex-1 py-2 rounded-lg border border-white/[0.1] text-sm text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-all font-light"
              >
                Cancelar
              </button>
              <form action={deleteDoctor.bind(null, id)} className="flex-1">
                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white text-sm font-medium transition-colors"
                >
                  Eliminar
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setConfirming(true)}
        className="p-1.5 text-white/25 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
      >
        <Trash2 size={14} strokeWidth={1.5} />
      </button>
    </>
  );
}
