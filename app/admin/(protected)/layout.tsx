import AdminNav from "@/components/admin/AdminNav";
import { requireAdminAuth } from "@/lib/auth/adminSession";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminAuth();

  return (
    <main className="min-h-screen bg-surface-dim text-inverse-on-surface">
      <div className="grid min-h-screen md:grid-cols-[260px_1fr]">
        <AdminNav />
        <section className="p-6 md:p-10">{children}</section>
      </div>
    </main>
  );
}
