"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

type PopupData = { id: number; version: number; titulo: string; contenido: string; frecuencia: string };

export default function HomePopup() {
  const [popup, setPopup] = useState<PopupData | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Con "cada ingreso" se muestra una vez por visita, no en cada vuelta al inicio.
        if (sessionStorage.getItem("mit_popup_seen") === "1") return;
        const res = await fetch("/api/popup", { cache: "no-store" });
        const { popup } = await res.json();
        if (cancelled || !popup) return;
        setPopup(popup);
        setOpen(true);
        sessionStorage.setItem("mit_popup_seen", "1");
        if (popup.frecuencia === "UNA_VEZ") {
          fetch("/api/popup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: popup.id, version: popup.version }),
          }).catch(() => {});
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || !popup) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] animate-[fadeIn_.25s_ease-out]"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label={popup.titulo || "Aviso"}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Cerrar"
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 text-gray-500 hover:text-gray-900 shadow-sm transition-colors"
        >
          <X size={16} strokeWidth={1.75} />
        </button>
        <div className="px-6 sm:px-8 py-8">
          {popup.titulo && (
            <h2 className="text-2xl font-light text-gray-800 leading-snug pr-8 mb-4">{popup.titulo}</h2>
          )}
          <div className="novedad-content" dangerouslySetInnerHTML={{ __html: popup.contenido }} />
        </div>
      </div>
    </div>
  );
}
