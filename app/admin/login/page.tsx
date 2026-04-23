"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      setError(payload?.error?.message ?? "Login failed");
      setLoading(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-surface-dim px-gutter-sm py-16 text-inverse-on-surface md:px-gutter">
      <div className="mx-auto max-w-lg border border-outline-variant/30 bg-inverse-surface p-8">
        <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">Authorized Access</p>
        <h1 className="mt-3 font-headline text-4xl font-black uppercase tracking-tight">Admin Login</h1>
        <form onSubmit={submit} className="mt-8 grid gap-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin email"
            className="border-b border-outline-variant/50 bg-transparent px-2 py-3 outline-none focus:border-primary"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border-b border-outline-variant/50 bg-transparent px-2 py-3 outline-none focus:border-primary"
          />
          {error ? <p className="text-sm text-error">{error}</p> : null}
          <button
            disabled={loading}
            className="mt-2 bg-primary px-6 py-3 font-label text-sm font-bold uppercase tracking-[0.15em] text-on-primary disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
