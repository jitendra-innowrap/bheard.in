import { listAllCareers } from "@/lib/services/careers.service";
import { seedCareers } from "@/lib/content/careersSeed";
import { PageHeader } from "@/components/admin/PageHeader";
import CareersTable from "@/components/admin/lists/CareersTable";

export default async function AdminCareersListPage() {
  let roles = [];
  try {
    roles = await listAllCareers();
  } catch {
    roles = seedCareers.map((item, index) => ({ ...item, id: index + 1 }));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin · Careers"
        title="Manage Roles"
        description="Control active openings with reusable sorting, search and pagination."
        action={{ href: "/admin/careers/new", label: "New Role" }}
      />
      <CareersTable rows={roles as any} />
    </div>
  );
}
