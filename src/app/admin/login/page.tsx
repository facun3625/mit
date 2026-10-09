"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import Image from "next/image";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null);

  return (
    <div className="min-h-screen bg-[#f6f7f9] flex items-center justify-center p-4">
      {/* Decoración fondo */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-mit-teal/[0.04] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#5f2c82]/[0.06] translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Image
            src="/images/mit_logo.svg"
            alt="Grupo MIT"
            width={140}
            height={60}
            className="brightness-0 invert opacity-80"
          />
        </div>

        {/* Card */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 backdrop-blur-sm">
          <h1 className="text-gray-900 text-xl font-light mb-1">Panel de administración</h1>
          <p className="text-gray-500 text-xs font-light mb-8 tracking-wide">Ingresá con tu cuenta</p>

          <form action={action} className="space-y-4">
            <div>
              <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-gray-500 mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-mit-teal/60 focus:bg-gray-100 transition-all duration-200"
                placeholder="admin@grupomit.com"
              />
            </div>

            <div>
              <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-gray-500 mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-mit-teal/60 focus:bg-gray-100 transition-all duration-200"
                placeholder="••••••••"
              />
            </div>

            {state?.error && (
              <p className="text-red-600 text-xs font-light py-2 px-3 bg-red-500/10 rounded-lg border border-red-500/20">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-mit-teal hover:bg-mit-teal-dark disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition-colors duration-300 mt-2"
            >
              {pending ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-400 text-[10px] font-light tracking-widest uppercase mt-8">
          Grupo MIT © 2025
        </p>
      </div>
    </div>
  );
}
