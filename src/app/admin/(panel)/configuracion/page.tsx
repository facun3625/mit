import { getConfiguracion } from "@/lib/configuracion";
import ConfiguracionForm from "@/components/admin/ConfiguracionForm";

export default async function ConfiguracionPage() {
  const { whatsapp } = await getConfiguracion();
  return <ConfiguracionForm whatsapp={whatsapp} />;
}
