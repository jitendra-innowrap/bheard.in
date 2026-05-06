/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BriefcaseBusiness, FileText, LayoutDashboard, Mail, Newspaper, Trophy } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";

type Counts = {
  blogs: number;
  careers: number;
  applicants: number;
  stories: number;
  leads: number;
};

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<Counts>({
    blogs: 0,
    careers: 0,
    applicants: 0,
    stories: 0,
    leads: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      const [blogs, careers, applicants, stories, leads] = await Promise.allSettled([
        fetch("/api/blog?includeDraft=true").then((r) => (r.ok ? r.json() : Promise.reject())),
        fetch("/api/careers?includeInactive=true").then((r) => (r.ok ? r.json() : Promise.reject())),
        fetch("/api/admin/career-applications").then((r) => (r.ok ? r.json() : Promise.reject())),
        fetch("/api/stories?includeDraft=true").then((r) => (r.ok ? r.json() : Promise.reject())),
        fetch("/api/contact-leads?admin=true").then((r) => (r.ok ? r.json() : Promise.reject())),
      ]);
      if (cancelled) return;
      setCounts({
        blogs: blogs.status === "fulfilled" ? (blogs.value.data?.length ?? 0) : 0,
        careers: careers.status === "fulfilled" ? (careers.value.data?.length ?? 0) : 0,
        applicants: applicants.status === "fulfilled" ? (applicants.value.data?.length ?? 0) : 0,
        stories: stories.status === "fulfilled" ? (stories.value.data?.length ?? 0) : 0,
        leads: leads.status === "fulfilled" ? (leads.value.data?.length ?? 0) : 0,
      });
      setLoading(false);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const modules = [
    {
      label: "Blogs",
      description: "Manage editorial posts, drafts, and publication flow.",
      value: counts.blogs,
      href: "/admin/blog",
      Icon: Newspaper,
    },
    {
      label: "Careers",
      description: "Manage open roles and keep hiring pages current.",
      value: counts.careers,
      href: "/admin/careers",
      Icon: BriefcaseBusiness,
    },
    {
      label: "Applicants",
      description: "Review candidate applications and resume submissions.",
      value: counts.applicants,
      href: "/admin/careers/applications",
      Icon: FileText,
    },
    {
      label: "CRM Leads",
      description: "Track inbound leads from web forms and campaign funnels.",
      value: counts.leads,
      href: "/admin/crm/leads",
      Icon: Mail,
    },
    {
      label: "Success Stories",
      description: "Curate case studies and publish proof-oriented narratives.",
      value: counts.stories,
      href: "/admin/success-stories",
      Icon: Trophy,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title="Admin Dashboard"
        description="Production-grade control center for content, hiring, inbound leads, and story publishing."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((item) => (
          <Link key={item.label} href={item.href} className="group block">
            <Card className="h-full rounded-2xl border-border/70 bg-card/90 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_16px_36px_-22px_rgba(0,0,0,0.35)]">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                    <item.Icon className="h-5 w-5" />
                  </div>
                  {loading ? (
                    <div className="h-9 w-14 animate-pulse rounded bg-muted" />
                  ) : (
                    <p className="font-headline text-3xl font-black text-foreground">{item.value}</p>
                  )}
                </div>
                <div>
                  <CardTitle className="text-xl">{item.label}</CardTitle>
                  <CardDescription className="mt-1 leading-relaxed">{item.description}</CardDescription>
                </div>
                <p className="pt-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">Open module →</p>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
        <LayoutDashboard className="h-4 w-4" />
        Real-time counts update from production data sources
      </div>
    </div>
  );
}
