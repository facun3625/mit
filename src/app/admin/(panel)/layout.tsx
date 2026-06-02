import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // login page doesn't use this layout (it's nested separately)
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#0f0f14] flex">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  );
}
