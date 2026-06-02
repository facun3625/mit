"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

async function uniqueSlug(base: string, excludeId?: number) {
  let slug = toSlug(base);
  let n = 0;
  while (true) {
    const candidate = n === 0 ? slug : `${slug}-${n}`;
    const exists = await prisma.novedad.findFirst({
      where: { slug: candidate, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
    });
    if (!exists) return candidate;
    n++;
  }
}

// ── Novedades ─────────────────────────────────────────────────────────────────

export async function createNovedad(prevState: void | { error?: string } | null, formData: FormData) {
  const titulo = (formData.get("titulo") as string)?.trim();
  const contenido = (formData.get("contenido") as string)?.trim();
  const imagenDestacada = (formData.get("imagenDestacada") as string)?.trim() || null;
  const publicado = formData.get("publicado") === "true";
  const destacada = formData.get("destacada") === "true";
  const categoriaId = formData.get("categoriaId") ? parseInt(formData.get("categoriaId") as string) : null;

  if (!titulo) return { error: "El título es obligatorio." };
  if (!contenido || contenido === "<p></p>") return { error: "El contenido no puede estar vacío." };

  const slug = await uniqueSlug(titulo);

  await prisma.novedad.create({
    data: { titulo, slug, contenido, imagenDestacada, publicado, destacada, categoriaId },
  });

  revalidatePath("/novedades");
  revalidatePath("/");
  redirect("/admin/novedades");
}

export async function updateNovedad(id: number, prevState: void | { error?: string } | null, formData: FormData) {
  const titulo = (formData.get("titulo") as string)?.trim();
  const contenido = (formData.get("contenido") as string)?.trim();
  const imagenDestacada = (formData.get("imagenDestacada") as string)?.trim() || null;
  const publicado = formData.get("publicado") === "true";
  const destacada = formData.get("destacada") === "true";
  const categoriaId = formData.get("categoriaId") ? parseInt(formData.get("categoriaId") as string) : null;

  if (!titulo) return { error: "El título es obligatorio." };

  const slug = await uniqueSlug(titulo, id);

  await prisma.novedad.update({
    where: { id },
    data: { titulo, slug, contenido, imagenDestacada, publicado, destacada, categoriaId },
  });

  revalidatePath("/novedades");
  revalidatePath("/");
  redirect("/admin/novedades");
}

export async function deleteNovedad(id: number) {
  await prisma.novedad.delete({ where: { id } });
  revalidatePath("/novedades");
  revalidatePath("/");
}

export async function togglePublicado(id: number, publicado: boolean) {
  await prisma.novedad.update({ where: { id }, data: { publicado } });
  revalidatePath("/novedades");
  revalidatePath("/");
}

// ── Categorias ────────────────────────────────────────────────────────────────

export async function createCategoria(formData: FormData) {
  const nombre = (formData.get("nombre") as string)?.trim();
  const color = (formData.get("color") as string)?.trim() || "#00b3a4";
  if (!nombre) return;

  const slug = toSlug(nombre);
  const exists = await prisma.categoriaNoticia.findUnique({ where: { nombre } });
  if (exists) return;

  await prisma.categoriaNoticia.create({ data: { nombre, slug, color } });
  revalidatePath("/admin/novedades");
}

export async function deleteCategoria(id: number) {
  await prisma.categoriaNoticia.delete({ where: { id } });
  revalidatePath("/admin/novedades");
}
