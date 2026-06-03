"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function toTitleCase(s: string): string {
  return s.toLowerCase().replace(/(^|\s)(\S)/g, (_, sp, ch) => sp + ch.toUpperCase());
}

// ── Especialidades ─────────────────────────────────────────────────────────────

export async function createEspecialidad(prevState: void | { error?: string } | null, formData: FormData) {
  const raw = (formData.get("nombre") as string)?.trim();
  if (!raw) return { error: "El nombre es obligatorio." };
  const nombre = toTitleCase(raw);

  const exists = await prisma.especialidad.findFirst({
    where: { nombre: { equals: nombre, mode: "insensitive" } },
  });
  if (exists) return { error: "Ya existe esa especialidad." };

  await prisma.especialidad.create({ data: { nombre } });
  revalidatePath("/admin/especialidades");
  return null;
}

export async function updateEspecialidad(id: number, prevState: void | { error?: string } | null, formData: FormData) {
  const raw = (formData.get("nombre") as string)?.trim();
  if (!raw) return { error: "El nombre es obligatorio." };
  const nombre = toTitleCase(raw);

  const exists = await prisma.especialidad.findFirst({
    where: { nombre: { equals: nombre, mode: "insensitive" }, NOT: { id } },
  });
  if (exists) return { error: "Ya existe esa especialidad." };

  await prisma.especialidad.update({ where: { id }, data: { nombre } });
  revalidatePath("/admin/especialidades");
  return null;
}

export async function deleteEspecialidad(id: number) {
  await prisma.especialidad.delete({ where: { id } });
  revalidatePath("/admin/especialidades");
}

export async function normalizeEspecialidades() {
  const all = await prisma.especialidad.findMany({ include: { doctores: true } });

  // Group by normalized name
  const groups = new Map<string, typeof all>();
  for (const esp of all) {
    const key = esp.nombre.trim().toLowerCase();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(esp);
  }

  for (const [, group] of groups) {
    const canonical = group.reduce((a, b) => (b.doctores.length > a.doctores.length ? b : a));
    const normalizedName = toTitleCase(canonical.nombre);

    // Rename canonical to normalized title case
    await prisma.especialidad.update({ where: { id: canonical.id }, data: { nombre: normalizedName } });

    // Merge duplicates into canonical
    for (const dup of group) {
      if (dup.id === canonical.id) continue;
      const canonDoctorIds = new Set(canonical.doctores.map((d) => d.doctorId));
      for (const rel of dup.doctores) {
        if (!canonDoctorIds.has(rel.doctorId)) {
          await prisma.doctorEspecialidad.create({
            data: { doctorId: rel.doctorId, especialidadId: canonical.id },
          });
        }
      }
      await prisma.especialidad.delete({ where: { id: dup.id } });
    }
  }

  revalidatePath("/admin/especialidades");
  revalidatePath("/staff");
}

// ── Sedes ──────────────────────────────────────────────────────────────────────

export async function createSede(prevState: void | { error?: string } | null, formData: FormData) {
  const nombre = (formData.get("nombre") as string)?.trim();
  if (!nombre) return { error: "El nombre es obligatorio." };

  const exists = await prisma.sede.findUnique({ where: { nombre } });
  if (exists) return { error: "Ya existe esa sede." };

  await prisma.sede.create({ data: { nombre } });
  revalidatePath("/admin/sedes");
  return null;
}

export async function updateSede(id: number, prevState: void | { error?: string } | null, formData: FormData) {
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
