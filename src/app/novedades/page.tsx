import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Tag } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function NovedadesPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;

  const [novedades, categorias] = await Promise.all([
    prisma.novedad.findMany({
      where: {
        publicado: true,
        ...(categoria ? { categoria: { slug: categoria } } : {}),
      },
      orderBy: [{ destacada: "desc" }, { createdAt: "desc" }],
      include: { categoria: true },
    }),
    prisma.categoriaNoticia.findMany({ orderBy: { nombre: "asc" } }),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="bg-mit-teal text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/[0.05] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-6 relative">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="inline-flex items-center gap-1.5 text-white/60 text-xs font-light tracking-wide hover:text-white transition-colors">
              <ArrowLeft size={13} strokeWidth={1.5} />
              Volver al inicio
            </Link>
            <div className="text-right">
              <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-white/55 mb-0.5">Últimas noticias</p>
              <h1 className="text-2xl md:text-3xl font-light leading-none">Novedades</h1>
            </div>
          </div>
          <div className="border-t border-white/15 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { valor: `${novedades.length}`, label: "Artículos" },
              { valor: `${categorias.length}`, label: "Categorías" },
              { valor: novedades.filter(n => n.destacada).length.toString(), label: "Destacados" },
              { valor: new Date().getFullYear().toString(), label: "Año actual" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-xl font-light tracking-tight">{s.valor}</p>
                <p className="text-[10px] font-light text-white/60 tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10">
        {/* Filtro categorías */}
        {categorias.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href="/novedades"
              className={`text-xs font-medium px-3.5 py-1.5 rounded-full border transition-all ${
                !categoria ? "bg-mit-teal text-white border-mit-teal" : "border-gray-200 text-gray-500 hover:border-mit-teal hover:text-mit-teal"
              }`}
            >
              Todas
            </Link>
            {categorias.map((c) => (
              <Link
                key={c.id}
                href={`/novedades?categoria=${c.slug}`}
                className={`text-xs font-medium px-3.5 py-1.5 rounded-full border transition-all ${
                  categoria === c.slug ? "text-white border-transparent" : "border-gray-200 text-gray-500 hover:border-gray-400"
                }`}
                style={categoria === c.slug ? { background: c.color, borderColor: c.color } : {}}
              >
                {c.nombre}
              </Link>
            ))}
          </div>
        )}

        {novedades.length === 0 ? (
          <p className="text-gray-400 text-sm font-light text-center py-20">No hay novedades publicadas todavía.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {novedades.map((n) => (
              <Link
                key={n.id}
                href={`/novedades/${n.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow-[0_1px_6px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="relative h-48 bg-gray-50 overflow-hidden">
                  {n.imagenDestacada
                    ? <Image src={n.imagenDestacada} alt={n.titulo} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full bg-gradient-to-br from-mit-teal/10 to-mit-purple/10 flex items-center justify-center">
                        <Tag size={32} strokeWidth={0.75} className="text-mit-teal/30" />
                      </div>
                  }
                  {n.destacada && (
                    <span className="absolute top-3 left-3 text-[9px] font-semibold bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full tracking-wide uppercase">Destacada</span>
                  )}
                  {n.categoria && (
                    <span className="absolute top-3 right-3 text-[9px] font-medium px-2 py-0.5 rounded-full text-white" style={{ background: n.categoria.color }}>
                      {n.categoria.nombre}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-[10px] text-gray-400 font-light flex items-center gap-1.5 mb-2">
                    <Calendar size={9} strokeWidth={1.5} />
                    {new Date(n.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                  <h3 className="text-sm font-medium text-gray-800 leading-snug line-clamp-2 mb-3">{n.titulo}</h3>
                  <span className="inline-flex items-center gap-1 text-[11px] text-mit-teal font-medium group-hover:gap-1.5 transition-all">
                    Leer más <ArrowRight size={10} strokeWidth={2} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
