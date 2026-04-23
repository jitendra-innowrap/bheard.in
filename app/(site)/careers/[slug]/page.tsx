import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CareerDetailView from "@/components/careers/CareerDetailView";
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

  return <CareerDetailView role={role} />;
}
