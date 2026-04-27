"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AdminProviders from "@/components/admin/AdminProviders";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { Button } from "@/components/admin/ui/button";
import { FormField } from "@/components/admin/ui/form-field";

const loginSchema = z.object({
  email: z.string().min(3, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const submit = form.handleSubmit(async (values) => {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      setError(payload?.error?.message ?? "Login failed");
      setLoading(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  });

  return (
    <AdminProviders>
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Authorized Access</p>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Sign in to manage blogs, careers, stories, and media.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="grid gap-4">
              <FormField label="Username / Email" error={form.formState.errors.email?.message}>
                <Input {...form.register("email")} placeholder="bheard_app" />
              </FormField>
              <FormField label="Password" error={form.formState.errors.password?.message}>
                <Input type="password" {...form.register("password")} placeholder="••••••••" />
              </FormField>
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              <Button type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </AdminProviders>
  );
}
