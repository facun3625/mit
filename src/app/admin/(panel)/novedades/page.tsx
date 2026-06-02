import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { togglePublicado, deleteNovedad, createCategoria, deleteCategoria } from "@/app/actions/novedades";
import { Plus, Pencil, Eye, EyeOff, Star, ImageIcon, Tag, Trash2 } from "lucide-react";
import DeleteDoctorButton from "@/components/admin/DeleteDoctorButton";

// Reuse confirm modal pattern inline
async function NovedadesPage() {
  const [novedades, categorias] = await Promise.all([
    prisma.novedad.findMany({
      orderBy: { createdAt: "desc" },
      include: { categoria: true },
    }),
    prisma.categoriaNoticia.findMany({
      orderBy: { nombre: "asc" },
      include: { _count: { select: { novedades: true } } },
    }),
  ]);

  return (
    <div className="p-8 max-w-6xl w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-white/30 text-xs font-light tracking-[0.2em] uppercase mb-1">Contenido</p>
          <h1 className="text-white text-2xl font-light">Novedades</h1>
          <p className="text-white/30 text-xs mt-1">{novedades.length} artículos</p>
        </div>
        <Link
          href="/admin/novedades/nueva"
          className="flex items-center gap-2 bg-mit-teal hover:bg-mit-teal-dark text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} strokeWidth={1.5} />
          Nueva novedad
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Lista novedades */}
        <div className="lg:col-span-2">
          {novedades.length === 0 ? (
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-12 text-center">
              <ImageIcon size={36} strokeWidth={1} className="text-white/15 mx-auto mb-3" />
              <p className="text-white/25 text-sm font-light">No hay novedades todavía.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {novedades.map((n) => (
                <div key={n.id} className="bg-white/[0.03] border border-white/[0.07] rounded-xl px-5 py-4 flex items-center gap-4 hover:bg-white/[0.05] transition-colors group">
                  {/* Imagen */}
                  <div className="w-14 h-14 rounded-lg bg-white/[0.05] flex-shrink-0 overflow-hidden">
                    {n.imagenDestacada
                      ? <Image src={n.imagenDestacada} alt={n.titulo} width={56} height={56} className="object-cover w-full h-full" />
                      : <ImageIcon size={20} strokeWidth={1} className="text-white/15 m-auto mt-3.5" />
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      {n.destacada && <Star size={10} strokeWidth={1.5} className="text-amber-400 flex-shrink-0" />}
                      {n.categoria && (
                        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: n.categoria.color + "25", color: n.categoria.color }}>
                          {n.categoria.nombre}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/75 font-light truncate">{n.titulo}</p>
                    <p className="text-[10px] text-white/25 font-light mt-0.5">
                      {new Date(n.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <form action={togglePublicado.bind(null, n.id, !n.publicado)}>
                      <button
                        type="submit"
                        className={`flex items-center gap-1 text-[10px] font-medium px-2.5 py-1 rounded-full transition-colors ${
                          n.publicado ? "bg-emerald-500/10 text-emerald-400" : "bg-white/[0.05] text-white/25"
                        }`}
                      >
                        {n.publicado ? <Eye size={10} strokeWidth={1.5} /> : <EyeOff size={10} strokeWidth={1.5} />}
                        {n.publicado ? "Pub." : "Draft"}
                      </button>
                    </form>
                    <Link href={`/admin/novedades/${n.id}`} className="p-1.5 text-white/25 hover:text-white/70 hover:bg-white/[0.06] rounded-lg transition-all">
                      <Pencil size={13} strokeWidth={1.5} />
                    </Link>
                    <form action={deleteNovedad.bind(null, n.id)}>
                      <button type="submit" className="p-1.5 text-white/25 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                        <Trash2 size={13} strokeWidth={1.5} />
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Categorías */}
        <div>
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-white/30 mb-4 flex items-center gap-1.5">
            <Tag size={10} strokeWidth={1.5} /> Categorías
          </p>

          <form action={createCategoria} className="flex gap-2 mb-4">
            <input
              type="text"
              name="nombre"
              placeholder="Nueva categoría..."
              className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-mit-teal/40 transition-all"
            />
            <input type="color" name="color" defaultValue="#00b3a4" className="w-9 h-9 rounded-lg border border-white/[0.08] bg-white/[0.04] cursor-pointer" />
            <button type="submit" className="p-2 bg-mit-teal/20 hover:bg-mit-teal/30 text-mit-teal rounded-lg transition-colors">
              <Plus size={14} strokeWidth={1.5} />
            </button>
          </form>

          <div className="space-y-1.5">
            {categorias.map((c) => (
              <div key={c.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] group">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                <span className="text-xs text-white/60 font-light flex-1">{c.nombre}</span>
                <span className="text-[10px] text-white/25">{c._count.novedades}</span>
                <form action={deleteCategoria.bind(null, c.id)}>
                  <button type="submit" className="opacity-0 group-hover:opacity-100 p-1 text-white/20 hover:text-red-400 transition-all">
                    <Trash2 size={11} strokeWidth={1.5} />
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NovedadesPage;
