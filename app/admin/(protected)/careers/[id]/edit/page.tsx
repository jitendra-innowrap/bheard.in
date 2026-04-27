import { notFound } from "next/navigation";
import CareerForm from "@/components/admin/CareerForm";
import { getCareerById } from "@/lib/services/careers.service";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/admin/ui/card";

type Params = { id: string };

export default async function AdminCareerEditPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const row = await getCareerById(id);
  if (!row) notFound();

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin · Careers" title="Edit Role" />
      <Card>
        <CardContent className="pt-5">
          <CareerForm
            mode="edit"
            initial={{
              slug: row.slug,
              title: row.title,
              department: row.department,
              type: row.type,
              location: row.location,
              description: row.description,
              active: row.active,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
