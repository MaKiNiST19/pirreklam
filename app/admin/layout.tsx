import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import AdminSidebar from "./AdminSidebar";

export const metadata = { title: "Yonetim Paneli | Pir Reklam" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const pathname = headerList.get("x-next-pathname") || "";
  const isLoginPage = pathname === "/admin/giris" || pathname.endsWith("/admin/giris");

  const session = await auth();

  // Login page or no session → render without sidebar
  if (isLoginPage || !session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar user={session.user as { name?: string | null; email?: string | null; role: string }} />
      <main className="flex-1 min-h-screen md:ml-56 ml-0">
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
