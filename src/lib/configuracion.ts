import { cache } from "react";
import { prisma } from "@/lib/prisma";

const DEFAULT_WHATSAPP = "+54 342 4 537262";

export const getConfiguracion = cache(async () => {
  const config = await prisma.configuracion.findFirst();
  return { whatsapp: config?.whatsapp ?? DEFAULT_WHATSAPP };
});

export function whatsappHref(whatsapp: string): string {
  return `https://wa.me/${whatsapp.replace(/\D/g, "")}`;
}
