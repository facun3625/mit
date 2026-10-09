import { prisma } from "@/lib/prisma";
import PopupForm from "@/components/admin/PopupForm";

export default async function PopupPage() {
  const popup = await prisma.popup.findFirst();
  const alcanzados = popup
    ? await prisma.popupVista.count({ where: { popupId: popup.id, version: popup.version } })
    : 0;

  return (
    <PopupForm
      popup={popup ? { titulo: popup.titulo, contenido: popup.contenido, activo: popup.activo, frecuencia: popup.frecuencia } : null}
      alcanzados={alcanzados}
    />
  );
}
