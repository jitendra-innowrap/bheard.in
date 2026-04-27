import Link from "next/link";
import { listAllBlogPosts } from "@/lib/services/blog.service";
import { listAllCareers } from "@/lib/services/careers.service";
import { listAllStories } from "@/lib/services/stories.service";
import { prisma } from "@/lib/db/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card";

export default async function AdminDashboardPage() {
  const [blogs, careers, stories, media] = await Promise.allSettled([
    listAllBlogPosts(),
    listAllCareers(),
    listAllStories(),
    prisma.mediaAsset.findMany(),
  ]);
  const blogCount = blogs.status === "fulfilled" ? blogs.value.length : 0;
  const careerCount = careers.status === "fulfilled" ? careers.value.length : 0;
  const storyCount = stories.status === "fulfilled" ? stories.value.length : 0;
  const mediaCount = media.status === "fulfilled" ? media.value.length : 0;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Overview" title="Dashboard" description="Production-grade content operations for admin modules." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Blog Posts", value: blogCount, href: "/admin/blog" },
          { label: "Career Roles", value: careerCount, href: "/admin/careers" },
          { label: "Success Stories", value: storyCount, href: "/admin/success-stories" },
          { label: "Media Assets", value: mediaCount, href: "/admin/media" },
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
