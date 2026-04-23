import Link from "next/link";
import { listAllCareers } from "@/lib/services/careers.service";
import { seedCareers } from "@/lib/content/careersSeed";

export default async function AdminCareersListPage() {
  let roles = [];
  try {
    roles = await listAllCareers();
  } catch {
    roles = seedCareers.map((item, index) => ({ ...item, id: index + 1 }));
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">Admin · Careers</p>
          <h1 className="mt-3 font-headline text-4xl font-black uppercase tracking-tight">All roles</h1>
        </div>
        <Link href="/admin/careers/new" className="bg-primary px-5 py-3 font-label text-sm font-bold uppercase tracking-[0.15em] text-on-primary">
          New role
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto border border-outline-variant/40">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-inverse-surface/60">
            <tr>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role: any) => (
              <tr key={role.id ?? role.slug} className="border-t border-outline-variant/30">
                <td className="px-4 py-3">{role.title}</td>
                <td className="px-4 py-3">{role.department}</td>
                <td className="px-4 py-3">{role.active ? "Active" : "Inactive"}</td>
                <td className="px-4 py-3">
                  <Link className="underline underline-offset-4" href={`/admin/careers/${role.id ?? 1}`}>
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
