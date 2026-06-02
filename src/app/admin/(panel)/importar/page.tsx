import { prisma } from "@/lib/prisma";
import ImportWizard from "@/components/admin/ImportWizard";

export default async function ImportarPage() {
  const sedes = await prisma.sede.findMany({ orderBy: { nombre: "asc" } });
  return <ImportWizard sedes={sedes} />;
}
