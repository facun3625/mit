"use client";

import { useActionState, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Star, Upload, X, Loader2 } from "lucide-react";
import TiptapEditor from "@/components/admin/TiptapEditor";
import { useUpload } from "@/lib/useUpload";

type Categoria = { id: number; nombre: string; color: string };
type Action = (prev: { error?: string } | null, form: FormData) => Promise<{ error?: string } | void>;

type Novedad = {
  id: number;
  titulo: string;
  contenido: string;
  imagenDestacada: string | null;
  publicado: boolean;
  destacada: boolean;
  categoriaId: number | null;
};

export default function NovedadForm({
  action,
  categorias,
  novedad,
}: {
  action: Action;
  categorias: Categoria[];
  novedad?: Novedad;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const [publicado, setPublicado] = useState(novedad?.publicado ?? false);
  const [destacada, setDestacada] = useState(novedad?.destacada ?? false);
  const [contenido, setContenido] = useState(novedad?.contenido ?? "");
  const [imgUrl, setImgUrl] = useState(novedad?.imagenDestacada ?? "");
  const { upload, uploading } = useUpload();
  const contenidoRef = useRef<HTMLInputElement>(null);

  async function handleUploadImg(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await upload(file);
    if (url) setImgUrl(url);
  }

  function handleSubmit(formData: FormData) {
    formData.set("contenido", contenido);
    formData.set("publicado", String(publicado));
    formData.set("destacada", String(destacada));
    formData.set("imagenDestacada", imgUrl);
    return formAction(formData);
  }

  return (
    <div className="p-8 max-w-4xl w-full">
      <Link href="/admin/novedades" className="inline-flex items-center gap-1.5 text-white/30 text-xs hover:text-white/60 transition-colors mb-8">
        <ArrowLeft size={13} strokeWidth={1.5} />
        Volver a novedades
      </Link>

      <p className="text-white/30 text-xs font-light tracking-[0.2em] uppercase mb-1">Novedades</p>
      <h1 className="text-white text-2xl font-light mb-8">{novedad ? "Editar novedad" : "Nueva novedad"}</h1>

      <form action={handleSubmit} className="space-y-6">
        {/* Título */}
        <div>
          <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-white/40 mb-1.5">Título *</label>
          <input
            type="text"
            name="titulo"
            required
            defaultValue={novedad?.titulo}
            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-mit-teal/60 transition-all"
            placeholder="Título de la novedad..."
          />
        </div>

        {/* Imagen destacada */}
        <div>
          <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-white/40 mb-2">
            Imagen destacada <span className="text-white/20 normal-case tracking-normal">(opcional)</span>
          </label>

          {imgUrl ? (
            <div className="relative w-full h-44 rounded-xl overflow-hidden group">
              <Image src={imgUrl} alt="Imagen destacada" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <label className="flex items-center gap-1.5 text-xs text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg cursor-pointer transition-colors">
                  <Upload size={12} strokeWidth={1.5} /> Cambiar
                  <input type="file" accept="image/*" className="sr-only" onChange={handleUploadImg} />
                </label>
                <button type="button" onClick={() => setImgUrl("")} className="flex items-center gap-1.5 text-xs text-white bg-red-500/60 hover:bg-red-500/80 px-3 py-1.5 rounded-lg transition-colors">
                  <X size={12} strokeWidth={1.5} /> Quitar
                </button>
              </div>
            </div>
          ) : (
            <label className={`flex flex-col items-center justify-center gap-2 w-full h-32 border-2 border-dashed border-white/[0.1] rounded-xl cursor-pointer hover:border-mit-teal/40 hover:bg-white/[0.02] transition-all ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
              <input type="file" accept="image/*" className="sr-only" onChange={handleUploadImg} />
              {uploading
                ? <><Loader2 size={20} strokeWidth={1.5} className="animate-spin text-mit-teal" /><span className="text-xs text-white/30">Subiendo...</span></>
                : <><Upload size={20} strokeWidth={1} className="text-white/20" /><span className="text-xs text-white/30 font-light">Subir imagen</span><span className="text-[10px] text-white/15">JPG, PNG, WEBP · máx 8MB</span></>
              }
            </label>
          )}
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-white/40 mb-1.5">Categoría</label>
          <select
            name="categoriaId"
            defaultValue={novedad?.categoriaId ?? ""}
            className="bg-white/[0.05] border border-white/[0.1] rounded-lg px-4 py-2.5 text-sm text-white/70 focus:outline-none focus:border-mit-teal/60 transition-all"
          >
            <option value="">Sin categoría</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        {/* Opciones */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setPublicado(!publicado)}
            className={`flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-lg border transition-all ${
              publicado ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-white/[0.04] border-white/[0.08] text-white/30"
            }`}
          >
            {publicado ? <Eye size={13} strokeWidth={1.5} /> : <EyeOff size={13} strokeWidth={1.5} />}
            {publicado ? "Publicado" : "Borrador"}
          </button>
          <button
            type="button"
            onClick={() => setDestacada(!destacada)}
            className={`flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-lg border transition-all ${
              destacada ? "bg-amber-500/10 border-amber-500/30 text-amber-400" : "bg-white/[0.04] border-white/[0.08] text-white/30"
            }`}
          >
            <Star size={13} strokeWidth={1.5} />
            {destacada ? "Destacada" : "No destacada"}
          </button>
        </div>

        {/* Editor */}
        <div>
          <label className="block text-[10px] font-medium tracking-[0.15em] uppercase text-white/40 mb-2">Contenido *</label>
          <TiptapEditor initialContent={novedad?.contenido ?? ""} onChange={setContenido} />
        </div>

        {state?.error && (
          <p className="text-red-400 text-xs py-2.5 px-4 bg-red-500/10 rounded-lg border border-red-500/20">{state.error}</p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={pending}
            className="bg-mit-teal hover:bg-mit-teal-dark disabled:opacity-50 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            {pending ? "Guardando..." : novedad ? "Guardar cambios" : "Crear novedad"}
          </button>
          <Link href="/admin/novedades" className="text-sm text-white/30 hover:text-white/60 transition-colors px-4 py-2.5">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
