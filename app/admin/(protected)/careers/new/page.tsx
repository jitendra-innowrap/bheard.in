import CareerForm from "@/components/admin/CareerForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/admin/ui/card";

export default function AdminCareerNewPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin · Careers" title="Create Role" />
      <Card>
        <CardContent className="pt-5">
          <CareerForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
