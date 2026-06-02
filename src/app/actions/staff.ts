"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createDoctor(prevState: { error?: string } | null, formData: FormData) {
  const nombre = (formData.get("nombre") as string)?.trim();
  const foto = (formData.get("foto") as string)?.trim() || null;
  const texto = (formData.get("texto") as string)?.trim() || null;
  const orden = parseInt(formData.get("orden") as string) || 0;
  const especialidadIds = formData.getAll("especialidades").map(Number);
  const sedeIds = formData.getAll("sedes").map(Number);

  if (!nombre) return { error: "El nombre es obligatorio." };
  if (especialidadIds.length === 0) return { error: "Seleccioná al menos una especialidad." };
  if (sedeIds.length === 0) return { error: "Seleccioná al menos una sede." };

  await prisma.doctor.create({
    data: {
      nombre,
      foto,
      texto,
      orden,
      especialidades: {
        create: especialidadIds.map((id) => ({ especialidadId: id })),
      },
      sedes: {
        create: sedeIds.map((id) => ({ sedeId: id })),
      },
    },
  });

  revalidatePath("/admin/staff");
  revalidatePath("/staff");
  redirect("/admin/staff");
}

export async function updateDoctor(id: number, prevState: { error?: string } | null, formData: FormData) {
  const nombre = (formData.get("nombre") as string)?.trim();
  const foto = (formData.get("foto") as string)?.trim() || null;
  const texto = (formData.get("texto") as string)?.trim() || null;
  const orden = parseInt(formData.get("orden") as string) || 0;
  const especialidadIds = formData.getAll("especialidades").map(Number);
  const sedeIds = formData.getAll("sedes").map(Number);

  if (!nombre) return { error: "El nombre es obligatorio." };
  if (especialidadIds.length === 0) return { error: "Seleccioná al menos una especialidad." };
  if (sedeIds.length === 0) return { error: "Seleccioná al menos una sede." };

  await prisma.doctor.update({
    where: { id },
    data: {
      nombre,
      foto,
      texto,
      orden,
      especialidades: {
        deleteMany: {},
        create: especialidadIds.map((eid) => ({ especialidadId: eid })),
      },
      sedes: {
        deleteMany: {},
        create: sedeIds.map((sid) => ({ sedeId: sid })),
      },
    },
  });

  revalidatePath("/admin/staff");
  revalidatePath("/staff");
  redirect("/admin/staff");
}

export async function toggleDoctor(id: number, activo: boolean) {
  await prisma.doctor.update({ where: { id }, data: { activo } });
  revalidatePath("/admin/staff");
  revalidatePath("/staff");
}

export async function deleteDoctor(id: number) {
  await prisma.doctor.delete({ where: { id } });
  revalidatePath("/admin/staff");
  revalidatePath("/staff");
}
