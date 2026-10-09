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
          <div className="bg-[#f6f7f9] border border-gray-200 rounded-2xl p-7 w-full max-w-xs shadow-2xl">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/10 mb-5 mx-auto">
              <AlertTriangle size={18} strokeWidth={1.5} className="text-red-600" />
            </div>
            <p className="text-gray-900 text-sm font-light text-center mb-1">¿Eliminar médico?</p>
            <p className="text-gray-500 text-xs font-light text-center mb-6">
              <span className="text-gray-800">"{nombre}"</span> será eliminado permanentemente.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirming(false)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-all font-light"
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
        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-all"
      >
        <Trash2 size={14} strokeWidth={1.5} />
      </button>
    </>
  );
}
