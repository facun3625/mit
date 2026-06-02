import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function NovedadPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const novedad = await prisma.novedad.findUnique({
    where: { slug, publicado: true },
    include: { categoria: true },
  });

  if (!novedad) notFound();

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      {/* Back */}
      <Link href="/novedades" className="inline-flex items-center gap-1.5 text-gray-400 text-xs font-light hover:text-mit-teal transition-colors mb-8">
        <ArrowLeft size={13} strokeWidth={1.5} />
        Volver a novedades
      </Link>

      {/* Categoria + fecha */}
      <div className="flex items-center gap-3 mb-4">
        {novedad.categoria && (
          <span className="text-[10px] font-semibold tracking-wide px-3 py-1 rounded-full text-white" style={{ background: novedad.categoria.color }}>
            {novedad.categoria.nombre}
          </span>
        )}
        <span className="text-xs text-gray-400 font-light flex items-center gap-1.5">
          <Calendar size={10} strokeWidth={1.5} />
          {new Date(novedad.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
        </span>
      </div>

      {/* Título */}
      <h1 className="text-3xl md:text-4xl font-light text-gray-800 leading-snug mb-8">{novedad.titulo}</h1>

      {/* Imagen destacada */}
      {novedad.imagenDestacada && (
        <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-10 shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
          <Image src={novedad.imagenDestacada} alt={novedad.titulo} fill className="object-cover" />
        </div>
      )}

      {/* Contenido */}
      <div
        className="novedad-content"
        dangerouslySetInnerHTML={{ __html: novedad.contenido }}
      />

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-gray-100">
        <Link href="/novedades" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-mit-teal transition-colors font-light">
          <ArrowLeft size={13} strokeWidth={1.5} />
          Ver todas las novedades
        </Link>
      </div>
    </article>
  );
}
