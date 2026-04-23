import type { Metadata } from "next";
import CareersListingView from "@/components/careers/CareersListingView";
import { listActiveCareers } from "@/lib/services/careers.service";
import { seedCareers } from "@/lib/content/careersSeed";

export const metadata: Metadata = {
  title: "Careers | BHEARD",
  description: "Join BHEARD to build meaningful brand and product systems with high ownership and quality standards.",
};

export const dynamic = "force-dynamic";

export default async function CareersListingPage() {
  let roles = [];
  try {
    roles = await listActiveCareers();
  } catch {
    roles = seedCareers.filter((role) => role.active);
  }
  return <CareersListingView roles={roles} />;
}
