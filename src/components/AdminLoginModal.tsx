"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { login } from "@/app/actions/auth";
import Image from "next/image";
import { X } from "lucide-react";

const STORAGE_KEY = "mit_admin_email";

export default function AdminLoginModal({ onClose }: { onClose: () => void }) {
  const [state, action, pending] = useActionState(login, null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [remember, setRemember] = useState(false);
  const [savedEmail, setSavedEmail] = useState("");

  // Load saved email on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSavedEmail(stored);
      setRemember(true);
    }
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  function handleSubmit(formData: FormData) {
    const email = formData.get("email") as string;
    if (remember && email) {
      localStorage.setItem(STORAGE_KEY, email);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    return action(formData);
  }

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
    >
      <div className="relative w-full max-w-sm bg-[#f6f7f9] border border-gray-200 rounded-2xl p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-mit-teal/[0.05] -translate-y-1/3 translate-x-1/3 pointer-events-none" />

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors p-1">
          <X size={18} strokeWidth={1.5} />
        </button>

        <div className="flex justify-center mb-7">
          <Image src="/images/mit_logo.svg" alt="Grupo MIT" width={110} height={48} className="brightness-0 invert opacity-70" />
        </div>

        <h2 className="text-gray-900 text-lg font-light mb-1">Panel de administración</h2>
        <p className="text-gray-500 text-xs font-light mb-7 tracking-wide">Ingresá con tu cuenta</p>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-gray-500 mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              defaultValue={savedEmail}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-mit-teal/60 focus:bg-gray-100 transition-all duration-200"
              placeholder="admin@grupomit.com"
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-gray-500 mb-1.5">Contraseña</label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-mit-teal/60 focus:bg-gray-100 transition-all duration-200"
              placeholder="••••••••"
            />
          </div>

          {/* Recordar */}
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-3.5 h-3.5 accent-[#00b3a4] rounded"
            />
            <span className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors font-light">Recordar usuario</span>
          </label>

          {state?.error && (
            <p className="text-red-600 text-xs py-2 px-3 bg-red-500/10 rounded-lg border border-red-500/20">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-mit-teal hover:bg-mit-teal-dark disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition-colors duration-300 mt-1"
          >
            {pending ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
