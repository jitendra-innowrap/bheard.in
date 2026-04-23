import CareerForm from "@/components/admin/CareerForm";

export default function AdminCareerNewPage() {
  return (
    <div>
      <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">Admin · Careers</p>
      <h1 className="mt-3 font-headline text-4xl font-black uppercase tracking-tight">Create role</h1>
      <div className="mt-8 border border-outline-variant/40 bg-inverse-surface/30 p-6">
        <CareerForm mode="create" />
      </div>
    </div>
  );
}
