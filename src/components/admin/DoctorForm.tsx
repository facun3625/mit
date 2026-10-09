"use client";

import { useActionState, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, X, Check } from "lucide-react";
import { createEspecialidad, createSede } from "@/app/actions/config";

type Especialidad = { id: number; nombre: string };
type Sede = { id: number; nombre: string };
type Doctor = {
  id: number;
  nombre: string;
  foto: string | null;
  texto: string | null;
  orden: number;
  especialidades: { especialidadId: number }[];
  sedes: { sedeId: number }[];
};

type Action = (prev: void | { error?: string } | null, form: FormData) => Promise<{ error?: string } | null>;

function toTitleCase(s: string): string {
  return s.toLowerCase().replace(/(^|\s)(\S)/g, (_, sp, ch) => sp + ch.toUpperCase());
}

// ── Quick-add inline ──────────────────────────────────────────────────────────

function QuickAdd({
  label,
  onAdd,
}: {
  label: string;
  onAdd: (nombre: string, id: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit() {
    if (!value.trim()) return;
    setError("");
    startTransition(async () => {
      const fd = new FormData();
      fd.set("nombre", value.trim());
      const action = label === "especialidad" ? createEspecialidad : createSede;
      const result = await action(null, fd);
      if (result?.error) {
        setError(result.error);
        return;
      }
      // Re-fetch updated list via router refresh would need full reload
      // Instead, optimistically add with a temp ID signal; parent re-renders on next navigation
      // For now we signal parent with name; real ID comes from server on next load
      // Simple: just close and tell user to refresh if needed
      // Better: use router.refresh()
      setValue("");
      setOpen(false);
      // Trigger a soft refresh to get the new ID
      window.location.reload();
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-mit-teal transition-colors mt-1"
      >
        <Plus size={11} strokeWidth={1.5} /> Nueva {label}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 mt-2">
      <input
        autoFocus
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submit(); } if (e.key === "Escape") setOpen(false); }}
        placeholder={`Nombre de la ${label}...`}
        className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-mit-teal/50 transition-all"
      />
      <button
        type="button"
        onClick={submit}
        disabled={isPending || !value.trim()}
        className="p-1.5 bg-mit-teal/20 hover:bg-mit-teal/30 text-mit-teal rounded-lg transition-colors disabled:opacity-40"
      >
        {isPending ? <div className="w-3 h-3 border border-mit-teal/40 border-t-mit-teal rounded-full animate-spin" /> : <Check size={12} strokeWidth={2} />}
      </button>
      <button type="button" onClick={() => { setOpen(false); setValue(""); setError(""); }} className="p-1.5 text-gray-500 hover:text-gray-600 rounded-lg transition-colors">
        <X size={12} strokeWidth={1.5} />
      </button>
      {error && <p className="text-red-600 text-[10px]">{error}</p>}
    </div>
  );
}

// ── Main form ─────────────────────────────────────────────────────────────────

export default function DoctorForm({
  action,
  especialidades,
  sedes,
  doctor,
}: {
  action: Action;
  especialidades: Especialidad[];
  sedes: Sede[];
  doctor?: Doctor;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  const selectedEsp = new Set(doctor?.especialidades.map((e) => e.especialidadId) ?? []);
  const selectedSedes = new Set(doctor?.sedes.map((s) => s.sedeId) ?? []);

  return (
    <div className="p-8 max-w-2xl w-full">
      <Link href="/admin/staff" className="inline-flex items-center gap-1.5 text-gray-500 text-xs hover:text-gray-600 transition-colors mb-8">
        <ArrowLeft size={13} strokeWidth={1.5} />
        Volver al listado
      </Link>

      <p className="text-gray-500 text-xs font-light tracking-[0.2em] uppercase mb-1">Staff Médico</p>
      <h1 className="text-gray-900 text-2xl font-light mb-8">
        {doctor ? "Editar médico" : "Nuevo médico"}
      </h1>

      <form action={formAction} className="space-y-6">
        {/* Nombre */}
        <div>
          <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-gray-500 mb-1.5">
            Nombre completo *
          </label>
          <input
            type="text"
            name="nombre"
            required
            defaultValue={doctor?.nombre}
            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-mit-teal/60 transition-all"
            placeholder="Dr. Juan Pérez"
          />
        </div>

        {/* Foto URL */}
        <div>
          <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-gray-500 mb-1.5">
            URL de foto <span className="text-gray-400 normal-case tracking-normal">(opcional)</span>
          </label>
          <input
            type="url"
            name="foto"
            defaultValue={doctor?.foto ?? ""}
            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-mit-teal/60 transition-all"
            placeholder="https://..."
          />
        </div>

        {/* Texto/Bio */}
        <div>
          <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-gray-500 mb-1.5">
            Descripción <span className="text-gray-400 normal-case tracking-normal">(opcional)</span>
          </label>
          <textarea
            name="texto"
            rows={3}
            defaultValue={doctor?.texto ?? ""}
            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-mit-teal/60 transition-all resize-none"
            placeholder="Breve descripción del médico..."
          />
        </div>

        {/* Especialidades */}
        <div>
          <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-gray-500 mb-3">
            Especialidades *
          </label>
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-2">
            <div className="grid grid-cols-2 gap-x-6 gap-y-0.5">
              {[...especialidades]
                .sort((a, b) => toTitleCase(a.nombre).localeCompare(toTitleCase(b.nombre), "es"))
                .map((e) => (
                  <label key={e.id} className="flex items-center gap-2.5 py-1.5 cursor-pointer group rounded-lg px-2 -mx-2 hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      name="especialidades"
                      value={e.id}
                      defaultChecked={selectedEsp.has(e.id)}
                      className="w-3.5 h-3.5 flex-shrink-0 accent-[#00b3a4] cursor-pointer"
                    />
                    <span className="text-xs text-gray-600 group-hover:text-gray-800 transition-colors font-light leading-tight">{toTitleCase(e.nombre)}</span>
                  </label>
                ))}
            </div>
          </div>
          <QuickAdd label="especialidad" onAdd={() => {}} />
        </div>

        {/* Sedes */}
        <div>
          <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-gray-500 mb-3">
            Sedes *
          </label>
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-2">
            <div className="flex flex-col gap-0.5">
              {sedes.map((s) => (
                <label key={s.id} className="flex items-center gap-3 py-2 px-2 -mx-2 cursor-pointer group rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    name="sedes"
                    value={s.id}
                    defaultChecked={selectedSedes.has(s.id)}
                    className="w-3.5 h-3.5 flex-shrink-0 accent-[#00b3a4] cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors font-light">{s.nombre}</span>
                </label>
              ))}
            </div>
          </div>
          <QuickAdd label="sede" onAdd={() => {}} />
        </div>

        {/* Orden */}
        <div>
          <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-gray-500 mb-1.5">
            Orden <span className="text-gray-400 normal-case tracking-normal">(0 = automático)</span>
          </label>
          <input
            type="number"
            name="orden"
            defaultValue={doctor?.orden ?? 0}
            min={0}
            className="w-28 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-mit-teal/60 transition-all"
          />
        </div>

        {state?.error && (
          <p className="text-red-600 text-xs py-2.5 px-4 bg-red-500/10 rounded-lg border border-red-500/20">
            {state.error}
          </p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={pending}
            className="bg-mit-teal hover:bg-mit-teal-dark disabled:opacity-50 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            {pending ? "Guardando..." : doctor ? "Guardar cambios" : "Crear médico"}
          </button>
          <Link href="/admin/staff" className="text-sm text-gray-500 hover:text-gray-600 transition-colors px-4 py-2.5">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
