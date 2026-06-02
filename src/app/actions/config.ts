"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

// ── Especialidades ─────────────────────────────────────────────────────────────

export async function createEspecialidad(prevState: { error?: string } | null, formData: FormData) {
  const nombre = (formData.get("nombre") as string)?.trim();
  if (!nombre) return { error: "El nombre es obligatorio." };

  const exists = await prisma.especialidad.findUnique({ where: { nombre } });
  if (exists) return { error: "Ya existe esa especialidad." };

  await prisma.especialidad.create({ data: { nombre } });
  revalidatePath("/admin/especialidades");
  return null;
}

export async function updateEspecialidad(id: number, prevState: { error?: string } | null, formData: FormData) {
  const nombre = (formData.get("nombre") as string)?.trim();
  if (!nombre) return { error: "El nombre es obligatorio." };

  const exists = await prisma.especialidad.findFirst({ where: { nombre, NOT: { id } } });
  if (exists) return { error: "Ya existe esa especialidad." };

  await prisma.especialidad.update({ where: { id }, data: { nombre } });
  revalidatePath("/admin/especialidades");
  return null;
}

export async function deleteEspecialidad(id: number) {
  await prisma.especialidad.delete({ where: { id } });
  revalidatePath("/admin/especialidades");
}

// ── Sedes ──────────────────────────────────────────────────────────────────────

export async function createSede(prevState: { error?: string } | null, formData: FormData) {
  const nombre = (formData.get("nombre") as string)?.trim();
  if (!nombre) return { error: "El nombre es obligatorio." };

  const exists = await prisma.sede.findUnique({ where: { nombre } });
  if (exists) return { error: "Ya existe esa sede." };

  await prisma.sede.create({ data: { nombre } });
  revalidatePath("/admin/sedes");
  return null;
}

export async function updateSede(id: number, prevState: { error?: string } | null, formData: FormData) {
  const nombre = (formData.get("nombre") as string)?.trim();
  if (!nombre) return { error: "El nombre es obligatorio." };

  const exists = await prisma.sede.findFirst({ where: { nombre, NOT: { id } } });
  if (exists) return { error: "Ya existe esa sede." };

  await prisma.sede.update({ where: { id }, data: { nombre } });
  revalidatePath("/admin/sedes");
  return null;
}

export async function deleteSede(id: number) {
  await prisma.sede.delete({ where: { id } });
  revalidatePath("/admin/sedes");
}
