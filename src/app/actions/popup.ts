"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function updatePopup(prevState: void | { error?: string; ok?: boolean } | null, formData: FormData) {
  if (!(await getSession())) return { error: "Sesión expirada." };

  const titulo = ((formData.get("titulo") as string) ?? "").trim().slice(0, 200);
  const contenido = (formData.get("contenido") as string) ?? "";
  const activo = formData.get("activo") === "true";
  const frecuencia = formData.get("frecuencia") === "SIEMPRE" ? "SIEMPRE" : "UNA_VEZ";

  const hasContent = titulo || contenido.replace(/<[^>]*>/g, "").trim() || contenido.includes("<img");
  if (activo && !hasContent) return { error: "Para activarlo agregá un título o contenido." };

  const existing = await prisma.popup.findFirst();
  if (existing) {
    // Si cambia el contenido, sube la versión y "una vez por IP" vuelve a mostrarse a todos.
    const changed = existing.titulo !== titulo || existing.contenido !== contenido;
    await prisma.popup.update({
      where: { id: existing.id },
      data: { titulo, contenido, activo, frecuencia, ...(changed ? { version: { increment: 1 } } : {}) },
    });
  } else {
    await prisma.popup.create({ data: { titulo, contenido, activo, frecuencia } });
  }

  revalidatePath("/admin/popup");
  return { ok: true };
}
