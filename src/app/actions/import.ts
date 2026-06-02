"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type ParsedRow = {
  especialidad: string;
  nombre: string;
  texto: string;
};

export type ExistingMatch = {
  id: number;
  nombre: string;
  especialidades: string[];
  sedes: string[];
};

export type CheckResult = {
  nombre: string;
  match: ExistingMatch | null;
};

// ── Check which doctors already exist ────────────────────────────────────────

export async function checkDoctors(nombres: string[]): Promise<CheckResult[]> {
  const doctors = await prisma.doctor.findMany({
    where: { nombre: { in: nombres } },
    include: {
      especialidades: { include: { especialidad: true } },
      sedes: { include: { sede: true } },
    },
  });

  const byName = new Map(doctors.map((d) => [d.nombre, d]));

  return nombres.map((nombre) => {
    const match = byName.get(nombre);
    return {
      nombre,
      match: match
        ? {
            id: match.id,
            nombre: match.nombre,
            especialidades: match.especialidades.map((e) => e.especialidad.nombre),
            sedes: match.sedes.map((s) => s.sede.nombre),
          }
        : null,
    };
  });
}

// ── Import rows ───────────────────────────────────────────────────────────────

export type ImportRow = {
  nombre: string;
  especialidad: string;
  texto: string;
  action: "crear" | "agregar" | "pisar" | "crear_nuevo";
};

export async function importStaff(rows: ImportRow[], sedeIds: number[]) {
  let created = 0;
  let updated = 0;
  let especialidadesCreadas = 0;

  for (const row of rows) {
    // Get or create especialidad
    let esp = await prisma.especialidad.findUnique({ where: { nombre: row.especialidad } });
    if (!esp) {
      esp = await prisma.especialidad.create({ data: { nombre: row.especialidad } });
      especialidadesCreadas++;
    }

    if (row.action === "crear" || row.action === "crear_nuevo") {
      // Create new doctor
      await prisma.doctor.create({
        data: {
          nombre: row.nombre,
          texto: row.texto || null,
          especialidades: { create: [{ especialidadId: esp.id }] },
          sedes: { create: sedeIds.map((id) => ({ sedeId: id })) },
        },
      });
      created++;
    } else if (row.action === "agregar") {
      // Find existing and add new data
      const existing = await prisma.doctor.findFirst({ where: { nombre: row.nombre } });
      if (!existing) continue;

      // Add especialidad if not already there
      const hasEsp = await prisma.doctorEspecialidad.findUnique({
        where: { doctorId_especialidadId: { doctorId: existing.id, especialidadId: esp.id } },
      });
      if (!hasEsp) {
        await prisma.doctorEspecialidad.create({
          data: { doctorId: existing.id, especialidadId: esp.id },
        });
      }

      // Add sedes if not already there
      for (const sedeId of sedeIds) {
        const hasSede = await prisma.doctorSede.findUnique({
          where: { doctorId_sedeId: { doctorId: existing.id, sedeId } },
        });
        if (!hasSede) {
          await prisma.doctorSede.create({ data: { doctorId: existing.id, sedeId } });
        }
      }
      updated++;
    } else if (row.action === "pisar") {
      // Find existing and overwrite
      const existing = await prisma.doctor.findFirst({ where: { nombre: row.nombre } });
      if (!existing) continue;

      await prisma.doctor.update({
        where: { id: existing.id },
        data: {
          texto: row.texto || null,
          especialidades: {
            deleteMany: {},
            create: [{ especialidadId: esp.id }],
          },
          sedes: {
            deleteMany: {},
            create: sedeIds.map((id) => ({ sedeId: id })),
          },
        },
      });
      updated++;
    }
  }

  revalidatePath("/admin/staff");
  revalidatePath("/staff");

  return { created, updated, especialidadesCreadas };
}
