import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CareerDetailView, { type CareerDetailRole } from "@/components/careers/CareerDetailView";
import { getActiveCareerBySlug } from "@/lib/services/careers.service";
import { seedCareers } from "@/lib/content/careersSeed";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  let role = null;
  try {
    role = await getActiveCareerBySlug(slug);
  } catch {
    role = seedCareers.find((item) => item.slug === slug && item.active) ?? null;
  }

  if (!role) return { title: "Role Not Found | BHEARD" };
  return {
    title: `${role.title} | BHEARD Careers`,
    description: `${role.title} - ${role.location} (${role.type})`,
  };
}

export default async function CareerDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  let role = null;
  try {
    role = await getActiveCareerBySlug(slug);
  } catch {
    role = seedCareers.find((item) => item.slug === slug && item.active) ?? null;
  }

  if (!role) {
    notFound();
  }

  const detail: CareerDetailRole = {
    slug: role.slug,
    title: role.title,
    department: role.department,
    type: role.type,
    location: role.location,
    description: role.description,
    ...("id" in role && typeof (role as { id?: string }).id === "string"
      ? { id: (role as { id: string }).id }
      : {}),
  };

  /** When false (e.g. seed fallback), full form still shows; submit prompts email / retries when API unavailable. */
  const onlineApplicationsReady = Boolean(process.env.DATABASE_URL && (role as { id?: string }).id);

  return <CareerDetailView role={detail} onlineApplicationsReady={onlineApplicationsReady} />;
}
