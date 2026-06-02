"use client";

import { useRouter, usePathname } from "next/navigation";

type Item = { id: number; nombre: string };

export default function StaffFilters({
  especialidades,
  sedes,
  selectedEsp,
  selectedSede,
}: {
  especialidades: Item[];
  sedes: Item[];
  selectedEsp?: string;
  selectedSede?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  function update(key: string, value: string) {
    const params = new URLSearchParams();
    if (key !== "esp" && selectedEsp) params.set("esp", selectedEsp);
    if (key !== "sede" && selectedSede) params.set("sede", selectedSede);
    if (value) params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  }

  function clear() { router.push(pathname); }

  const hasFilter = selectedEsp || selectedSede;

  return (
    <div className="flex flex-wrap items-center gap-3 mb-8">
      <select
        value={selectedEsp ?? ""}
        onChange={(e) => update("esp", e.target.value)}
        className="text-sm font-light text-gray-600 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-mit-teal/60 transition-colors"
      >
        <option value="">Todas las especialidades</option>
        {especialidades.map((e) => (
          <option key={e.id} value={e.id}>{e.nombre}</option>
        ))}
      </select>

      <select
        value={selectedSede ?? ""}
        onChange={(e) => update("sede", e.target.value)}
        className="text-sm font-light text-gray-600 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-mit-teal/60 transition-colors"
      >
        <option value="">Todas las sedes</option>
        {sedes.map((s) => (
          <option key={s.id} value={s.id}>{s.nombre}</option>
        ))}
      </select>

      {hasFilter && (
        <button
          onClick={clear}
          className="text-xs font-light text-gray-400 hover:text-mit-teal transition-colors underline underline-offset-2"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
