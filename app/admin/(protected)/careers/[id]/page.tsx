import { notFound } from "next/navigation";
import CareerForm from "@/components/admin/CareerForm";
import { getCareerById } from "@/lib/services/careers.service";

type Params = { id: string };

export default async function AdminCareerEditPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const row = await getCareerById(Number(id));
  if (!row) notFound();

  return (
    <div>
      <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">Admin · Careers</p>
      <h1 className="mt-3 font-headline text-4xl font-black uppercase tracking-tight">Edit role</h1>
      <div className="mt-8 border border-outline-variant/40 bg-inverse-surface/30 p-6">
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
      </div>
    </div>
  );
}
