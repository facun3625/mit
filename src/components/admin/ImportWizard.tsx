"use client";

import { useState, useTransition } from "react";
import {
  Upload, ChevronRight, ChevronLeft, Check,
  FileSpreadsheet, Plus, RefreshCw, UserRound, Loader2, X
} from "lucide-react";
import * as XLSX from "xlsx";
import { checkDoctors, importStaff } from "@/app/actions/import";
import type { ImportRow } from "@/app/actions/import";

type Sede = { id: number; nombre: string };

type RowAction = "crear" | "agregar" | "pisar" | "crear_nuevo";

type PreviewRow = {
  especialidad: string;
  nombre: string;
  texto: string;
  existeId: number | null;
  existeSedes: string[];
  existeEsps: string[];
  action: RowAction;
};

// ── CSV parser ────────────────────────────────────────────────────────────────

function parseCSV(raw: string): { especialidad: string; nombre: string; texto: string }[] {
  const lines = raw.trim().split("\n").filter(Boolean);
  if (lines.length === 0) return [];

  // Detect separator
  const first = lines[0];
  const sep = first.includes(";") ? ";" : first.includes("\t") ? "\t" : ",";

  // Skip header if first row looks like a header
  const start = /especialidad|medico|médico/i.test(lines[0]) ? 1 : 0;

  return lines.slice(start).map((line) => {
    const cols = line.split(sep).map((c) => c.trim().replace(/^"|"$/g, ""));
    return {
      especialidad: cols[0] ?? "",
      nombre: cols[1] ?? "",
      texto: cols[2] ?? "",
    };
  }).filter((r) => r.nombre && r.especialidad);
}

// ── Step indicators ───────────────────────────────────────────────────────────

function Steps({ current }: { current: number }) {
  const steps = ["Datos", "Sedes", "Preview", "Resultado"];
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 text-xs font-light transition-colors ${
            i === current ? "text-mit-teal" : i < current ? "text-white/40" : "text-white/20"
          }`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium ${
              i < current ? "bg-mit-teal/20 text-mit-teal" :
              i === current ? "bg-mit-teal text-white" : "bg-white/[0.06] text-white/20"
            }`}>
              {i < current ? <Check size={10} strokeWidth={2} /> : i + 1}
            </span>
            {s}
          </div>
          {i < steps.length - 1 && <div className="w-6 h-px bg-white/[0.08]" />}
        </div>
      ))}
    </div>
  );
}

// ── Action badge ──────────────────────────────────────────────────────────────

const ACTION_STYLES: Record<RowAction, { label: string; color: string; icon: React.ReactNode }> = {
  crear: { label: "Nuevo", color: "bg-emerald-500/10 text-emerald-400", icon: <Plus size={10} strokeWidth={2} /> },
  agregar: { label: "Agregar", color: "bg-blue-500/10 text-blue-400", icon: <Plus size={10} strokeWidth={2} /> },
  pisar: { label: "Pisar", color: "bg-amber-500/10 text-amber-400", icon: <RefreshCw size={10} strokeWidth={2} /> },
  crear_nuevo: { label: "Crear nuevo", color: "bg-purple-500/10 text-purple-400", icon: <UserRound size={10} strokeWidth={2} /> },
};

// ── Main wizard ───────────────────────────────────────────────────────────────

export default function ImportWizard({ sedes }: { sedes: Sede[] }) {
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [parsedCount, setParsedCount] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [selectedSedes, setSelectedSedes] = useState<number[]>([]);
  const [rows, setRows] = useState<PreviewRow[]>([]);
  const [result, setResult] = useState<{ created: number; updated: number; especialidadesCreadas: number } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleFile(f: File) {
    setFile(f);
    const reader = new FileReader();
    const isExcel = /\.(xlsx|xls)$/i.test(f.name);

    reader.onload = (e) => {
      let parsed: { especialidad: string; nombre: string; texto: string }[] = [];

      if (isExcel) {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 });
        const start = /especialidad|medico|médico/i.test(String(rows[0]?.[0])) ? 1 : 0;
        parsed = rows.slice(start)
          .filter((r) => r[0] && r[1])
          .map((r) => ({
            especialidad: String(r[0] ?? "").trim(),
            nombre: String(r[1] ?? "").trim(),
            texto: String(r[2] ?? "").trim(),
          }));
      } else {
        parsed = parseCSV(e.target?.result as string);
      }

      setParsedCount(parsed.length);
      sessionStorage.setItem("mit_import_parsed", JSON.stringify(parsed));
    };

    isExcel ? reader.readAsArrayBuffer(f) : reader.readAsText(f);
  }

  // Step 0 → 1: parse CSV
  function handleParse() {
    if (parsedCount === 0) return;
    setStep(1);
  }

  // Step 1 → 2: check existing doctors
  function handleCheckDoctors() {
    const parsed = JSON.parse(sessionStorage.getItem("mit_import_parsed") ?? "[]");
    if (selectedSedes.length === 0) return;

    startTransition(async () => {
      const nombres = parsed.map((r: { nombre: string }) => r.nombre);
      const checks = await checkDoctors(nombres);
      const checkMap = new Map(checks.map((c) => [c.nombre, c.match]));

      const preview: PreviewRow[] = parsed.map((r: { especialidad: string; nombre: string; texto: string }) => {
        const match = checkMap.get(r.nombre) ?? null;
        return {
          ...r,
          existeId: match?.id ?? null,
          existeSedes: match?.sedes ?? [],
          existeEsps: match?.especialidades ?? [],
          action: match ? "agregar" : "crear",
        };
      });

      setRows(preview);
      setStep(2);
    });
  }

  // Step 2 → 3: import
  function handleImport() {
    startTransition(async () => {
      const importRows: ImportRow[] = rows.map((r) => ({
        nombre: r.nombre,
        especialidad: r.especialidad,
        texto: r.texto,
        action: r.action,
      }));

      const res = await importStaff(importRows, selectedSedes);
      setResult(res);
      setStep(3);
    });
  }

  function toggleSede(id: number) {
    setSelectedSedes((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  function setRowAction(idx: number, action: RowAction) {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, action } : r)));
  }

  // ── Render steps ────────────────────────────────────────────────────────────

  return (
    <div className="p-8 max-w-4xl w-full">
      <p className="text-white/30 text-xs font-light tracking-[0.2em] uppercase mb-1">Staff Médico</p>
      <h1 className="text-white text-2xl font-light mb-8">Importar médicos</h1>

      <Steps current={step} />

      {/* ── Step 0: Upload ── */}
      {step === 0 && (
        <div className="space-y-6">
          <p className="text-white/35 text-sm font-light">
            Subí un archivo <span className="text-white/60">.csv</span> o <span className="text-white/60">.xls / .xlsx</span> con columnas:{" "}
            <span className="text-white/60">especialidad · médico · observaciones</span>. Separador automático.
          </p>

          {/* Drop zone */}
          <label
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files[0];
              if (f) handleFile(f);
            }}
            className={`relative flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-2xl py-16 cursor-pointer transition-all duration-200 ${
              dragOver
                ? "border-mit-teal/60 bg-mit-teal/[0.06]"
                : file
                ? "border-emerald-500/40 bg-emerald-500/[0.04]"
                : "border-white/[0.1] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
            }`}
          >
            <input
              type="file"
              accept=".csv,.xls,.xlsx,.txt"
              className="sr-only"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />

            {file ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <FileSpreadsheet size={28} strokeWidth={1} className="text-emerald-400" />
                </div>
                <div className="text-center">
                  <p className="text-white/80 text-sm font-medium">{file.name}</p>
                  <p className="text-emerald-400 text-xs font-light mt-1">{parsedCount} registros detectados</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setFile(null); setParsedCount(0); }}
                  className="absolute top-4 right-4 p-1.5 text-white/20 hover:text-white/60 hover:bg-white/[0.06] rounded-lg transition-all"
                >
                  <X size={14} strokeWidth={1.5} />
                </button>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-white/[0.05] flex items-center justify-center">
                  <Upload size={24} strokeWidth={1} className="text-white/30" />
                </div>
                <div className="text-center">
                  <p className="text-white/50 text-sm font-light">Arrastrá el archivo acá</p>
                  <p className="text-white/25 text-xs font-light mt-1">o hacé click para seleccionar</p>
                </div>
                <p className="text-white/15 text-[10px] font-light tracking-wide uppercase">CSV · XLS · XLSX</p>
              </>
            )}
          </label>

          <div className="flex justify-end">
            <button
              onClick={handleParse}
              disabled={parsedCount === 0}
              className="flex items-center gap-2 bg-mit-teal hover:bg-mit-teal-dark disabled:opacity-30 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Siguiente <ChevronRight size={15} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}

      {/* ── Step 1: Sedes ── */}
      {step === 1 && (
        <div className="space-y-6">
          <p className="text-white/40 text-sm font-light">
            ¿A qué sede(s) pertenecen los médicos de este lote?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {sedes.map((s) => {
              const sel = selectedSedes.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggleSede(s.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-light text-left transition-all ${
                    sel
                      ? "bg-mit-teal/10 border-mit-teal/40 text-mit-teal"
                      : "bg-white/[0.03] border-white/[0.07] text-white/40 hover:border-white/20 hover:text-white/60"
                  }`}
                >
                  <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                    sel ? "bg-mit-teal border-mit-teal" : "border-white/20"
                  }`}>
                    {sel && <Check size={10} strokeWidth={2.5} className="text-white" />}
                  </span>
                  {s.nombre}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button onClick={() => setStep(0)} className="flex items-center gap-1.5 text-sm text-white/30 hover:text-white/60 transition-colors">
              <ChevronLeft size={15} strokeWidth={1.5} /> Atrás
            </button>
            <button
              onClick={handleCheckDoctors}
              disabled={selectedSedes.length === 0 || isPending}
              className="flex items-center gap-2 bg-mit-teal hover:bg-mit-teal-dark disabled:opacity-30 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors ml-auto"
            >
              {isPending ? <Loader2 size={15} strokeWidth={1.5} className="animate-spin" /> : null}
              Ver preview <ChevronRight size={15} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Preview ── */}
      {step === 2 && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="flex gap-4 text-xs font-light text-white/40 mb-2">
            <span className="text-emerald-400">{rows.filter(r => r.action === "crear").length} nuevos</span>
            <span className="text-blue-400">{rows.filter(r => r.action === "agregar").length} agregar</span>
            <span className="text-amber-400">{rows.filter(r => r.action === "pisar").length} pisar</span>
            <span className="text-purple-400">{rows.filter(r => r.action === "crear_nuevo").length} crear nuevo</span>
          </div>

          <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left px-4 py-2.5 text-[10px] font-medium tracking-[0.15em] uppercase text-white/25">Médico</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-medium tracking-[0.15em] uppercase text-white/25">Especialidad</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-medium tracking-[0.15em] uppercase text-white/25 hidden md:table-cell">Obs.</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-medium tracking-[0.15em] uppercase text-white/25">Acción</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const style = ACTION_STYLES[row.action];
                  const isExisting = row.existeId !== null;
                  return (
                    <tr key={i} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
                      <td className="px-4 py-2.5">
                        <p className="text-sm text-white/70 font-light">{row.nombre}</p>
                        {isExisting && (
                          <p className="text-[10px] text-white/25 mt-0.5">
                            Sedes: {row.existeSedes.join(", ") || "—"}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-xs text-white/50 font-light">{row.especialidad}</span>
                      </td>
                      <td className="px-4 py-2.5 hidden md:table-cell">
                        <span className="text-xs text-white/30 font-light">{row.texto || "—"}</span>
                      </td>
                      <td className="px-4 py-2.5">
                        {isExisting ? (
                          <select
                            value={row.action}
                            onChange={(e) => setRowAction(i, e.target.value as RowAction)}
                            className="bg-white/[0.05] border border-white/[0.1] rounded-lg px-2 py-1 text-xs text-white/60 focus:outline-none focus:border-mit-teal/40 transition-all"
                          >
                            <option value="agregar">Agregar</option>
                            <option value="pisar">Pisar</option>
                            <option value="crear_nuevo">Crear nuevo</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${style.color}`}>
                            {style.icon}{style.label}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-sm text-white/30 hover:text-white/60 transition-colors">
              <ChevronLeft size={15} strokeWidth={1.5} /> Atrás
            </button>
            <button
              onClick={handleImport}
              disabled={isPending}
              className="flex items-center gap-2 bg-mit-teal hover:bg-mit-teal-dark disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors ml-auto"
            >
              {isPending ? <Loader2 size={15} strokeWidth={1.5} className="animate-spin" /> : <Upload size={15} strokeWidth={1.5} />}
              Importar {rows.length} médicos
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Result ── */}
      {step === 3 && result && (
        <div className="text-center py-12">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
            <Check size={24} strokeWidth={1.5} className="text-emerald-400" />
          </div>
          <h2 className="text-white text-xl font-light mb-2">¡Importación completada!</h2>
          <div className="flex justify-center gap-8 mt-6 mb-8">
            <div>
              <p className="text-2xl font-light text-emerald-400">{result.created}</p>
              <p className="text-xs text-white/30 font-light">médicos nuevos</p>
            </div>
            <div>
              <p className="text-2xl font-light text-blue-400">{result.updated}</p>
              <p className="text-xs text-white/30 font-light">actualizados</p>
            </div>
            <div>
              <p className="text-2xl font-light text-amber-400">{result.especialidadesCreadas}</p>
              <p className="text-xs text-white/30 font-light">especialidades nuevas</p>
            </div>
          </div>
          <div className="flex justify-center gap-3">
            <a href="/admin/staff" className="bg-mit-teal hover:bg-mit-teal-dark text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
              Ver staff médico
            </a>
            <button
              onClick={() => { setStep(0); setRawText(""); setSelectedSedes([]); setRows([]); setResult(null); }}
              className="border border-white/[0.1] text-white/40 hover:text-white/70 text-sm font-light px-5 py-2.5 rounded-lg transition-colors"
            >
              Nueva importación
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
