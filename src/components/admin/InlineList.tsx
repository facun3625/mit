"use client";

import { useActionState, useState } from "react";
import { Plus, Pencil, Trash2, Check, X, AlertTriangle } from "lucide-react";

type Action = (prev: void | { error?: string } | null, form: FormData) => Promise<{ error?: string } | null>;
type DeleteAction = () => Promise<void>;

export type InlineItem = {
  id: number;
  nombre: string;
  updateAction: Action;
  deleteAction: DeleteAction;
  _count?: { doctores: number };
};

// ── Confirm modal ─────────────────────────────────────────────────────────────

function ConfirmModal({
  nombre,
  onConfirm,
  onCancel,
}: {
  nombre: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0f0f14] border border-white/[0.1] rounded-2xl p-7 w-full max-w-xs shadow-2xl">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/10 mb-5 mx-auto">
          <AlertTriangle size={18} strokeWidth={1.5} className="text-red-400" />
        </div>
        <p className="text-white text-sm font-light text-center mb-1">¿Eliminar este registro?</p>
        <p className="text-white/40 text-xs font-light text-center mb-6">
          <span className="text-white/70">"{nombre}"</span> será eliminado permanentemente.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg border border-white/[0.1] text-sm text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-all font-light"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white text-sm font-medium transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Add form ──────────────────────────────────────────────────────────────────

function AddForm({ createAction }: { createAction: Action }) {
  const [state, action, pending] = useActionState(createAction, null);
  return (
    <form action={action} className="flex items-center gap-2 mb-6">
      <input
        type="text"
        name="nombre"
        required
        placeholder="Nombre nuevo..."
        className="flex-1 bg-white/[0.05] border border-white/[0.1] rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-mit-teal/60 transition-all"
      />
      <button
        type="submit"
        disabled={pending}
        className="flex items-center gap-1.5 bg-mit-teal hover:bg-mit-teal-dark disabled:opacity-50 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap"
      >
        <Plus size={15} strokeWidth={1.5} />
        Agregar
      </button>
      {state?.error && <p className="text-red-400 text-xs ml-1">{state.error}</p>}
    </form>
  );
}

// ── Edit row ──────────────────────────────────────────────────────────────────

function EditRow({ item }: { item: InlineItem }) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [state, formAction, pending] = useActionState(
    async (prev: void | { error?: string } | null, form: FormData) => {
      const result = await item.updateAction(prev ?? null, form);
      if (!result?.error) setEditing(false);
      return result;
    },
    null
  );

  const usedBy = item._count?.doctores ?? 0;

  return (
    <>
      {confirming && (
        <ConfirmModal
          nombre={item.nombre}
          onCancel={() => setConfirming(false)}
          onConfirm={async () => {
            setConfirming(false);
            await item.deleteAction();
          }}
        />
      )}

      {editing ? (
        <form action={formAction} className="flex items-center gap-2 py-2 px-4 bg-white/[0.05] rounded-lg">
          <input
            type="text"
            name="nombre"
            defaultValue={item.nombre}
            required
            autoFocus
            className="flex-1 bg-transparent text-sm text-white focus:outline-none"
          />
          <button type="submit" disabled={pending} className="p-1.5 text-mit-teal hover:bg-mit-teal/10 rounded transition-colors">
            <Check size={14} strokeWidth={1.5} />
          </button>
          <button type="button" onClick={() => setEditing(false)} className="p-1.5 text-white/30 hover:text-white/60 rounded transition-colors">
            <X size={14} strokeWidth={1.5} />
          </button>
          {state?.error && <p className="text-red-400 text-xs">{state.error}</p>}
        </form>
      ) : (
        <div className="flex items-center gap-3 py-2.5 px-4 rounded-lg hover:bg-white/[0.03] group transition-colors">
          <span className="flex-1 text-sm text-white/70 font-light">{item.nombre}</span>
          {usedBy > 0 && (
            <span className="text-[10px] text-white/25 font-light">{usedBy} médico{usedBy !== 1 ? "s" : ""}</span>
          )}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setEditing(true)}
              className="p-1.5 text-white/30 hover:text-white/70 hover:bg-white/[0.06] rounded-lg transition-all"
            >
              <Pencil size={13} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setConfirming(true)}
              disabled={usedBy > 0}
              title={usedBy > 0 ? "Tiene médicos asignados" : "Eliminar"}
              className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <Trash2 size={13} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function InlineList({
  items,
  createAction,
  title,
  subtitle,
}: {
  items: InlineItem[];
  createAction: Action;
  title: string;
  subtitle: string;
}) {
  return (
    <div className={title ? "p-8 max-w-2xl w-full" : "max-w-2xl w-full"}>
      {title && (
        <>
          <p className="text-white/30 text-xs font-light tracking-[0.2em] uppercase mb-1">Configuración</p>
          <h1 className="text-white text-2xl font-light mb-1">{title}</h1>
          <p className="text-white/25 text-xs font-light mb-8">{subtitle}</p>
        </>
      )}

      <AddForm createAction={createAction} />

      <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden">
        {items.length === 0 ? (
          <p className="text-white/25 text-sm font-light text-center py-10">No hay registros todavía.</p>
        ) : (
          <div className="divide-y divide-white/[0.04] px-0 py-2">
            {items.map((item) => (
              <EditRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      <p className="text-white/20 text-xs font-light mt-4">{items.length} registros</p>
    </div>
  );
}
