import Link from "next/link";
import { listAllBlogPosts } from "@/lib/services/blog.service";
import { listCareerApplications } from "@/lib/services/careerApplications.service";
import { listAllCareers } from "@/lib/services/careers.service";
import { listAllStories } from "@/lib/services/stories.service";
import { listAllPages } from "@/lib/services/page.service";
import { listContactLeads } from "@/lib/services/contactLeads.service";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card";

export default async function AdminDashboardPage() {
  const [blogs, careers, applicants, stories, pages, leads] = await Promise.allSettled([
    listAllBlogPosts(),
    listAllCareers(),
    listCareerApplications(),
    listAllStories(),
    listAllPages(),
    listContactLeads(),
  ]);
  const blogCount = blogs.status === "fulfilled" ? blogs.value.length : 0;
  const careerCount = careers.status === "fulfilled" ? careers.value.length : 0;
  const applicantCount = applicants.status === "fulfilled" ? applicants.value.length : 0;
  const storyCount = stories.status === "fulfilled" ? stories.value.length : 0;
  const pageCount = pages.status === "fulfilled" ? pages.value.length : 0;
  const leadCount = leads.status === "fulfilled" ? leads.value.length : 0;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Overview" title="Dashboard" description="Production-grade content operations for admin modules." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {[
          { label: "Blog Posts", value: blogCount, href: "/admin/blog" },
          { label: "Career Roles", value: careerCount, href: "/admin/careers" },
          { label: "Applicants", value: applicantCount, href: "/admin/careers/applications" },
          { label: "CRM Leads", value: leadCount, href: "/admin/crm/leads" },
          { label: "Success Stories", value: storyCount, href: "/admin/success-stories" },
          { label: "Legal Pages", value: pageCount, href: "/admin/pages" },
        ].map((item) => (
          <Card key={item.label}>
            <CardHeader>
              <CardDescription>{item.label}</CardDescription>
              <CardTitle className="text-4xl">{item.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href={item.href} className="text-sm text-primary underline-offset-4 hover:underline">
                Open module
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
