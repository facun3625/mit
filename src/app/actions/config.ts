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

  const groups = new Map<string, typeof all>();
  for (const esp of all) {
    const key = esp.nombre.trim().toLowerCase();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(esp);
  }

  for (const [, group] of groups) {
    const normalizedName = toTitleCase(group[0].nombre);
    // Pick canonical: prefer already-normalized name, else most doctors
    const canonical =
      group.find((e) => e.nombre === normalizedName) ??
      group.reduce((a, b) => (b.doctores.length > a.doctores.length ? b : a));

    const duplicates = group.filter((e) => e.id !== canonical.id);
    const canonDoctorIds = new Set(canonical.doctores.map((d) => d.doctorId));

    for (const dup of duplicates) {
      // Reassign doctors not already on canonical
      for (const rel of dup.doctores) {
        if (!canonDoctorIds.has(rel.doctorId)) {
          await prisma.doctorEspecialidad.create({
            data: { doctorId: rel.doctorId, especialidadId: canonical.id },
          });
          canonDoctorIds.add(rel.doctorId);
        }
      }
      // Must delete FK rows before deleting the especialidad (no cascade defined)
      await prisma.doctorEspecialidad.deleteMany({ where: { especialidadId: dup.id } });
      await prisma.especialidad.delete({ where: { id: dup.id } });
    }

    // Rename AFTER duplicates are gone (avoids unique constraint collision)
    if (canonical.nombre !== normalizedName) {
      await prisma.especialidad.update({ where: { id: canonical.id }, data: { nombre: normalizedName } });
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
