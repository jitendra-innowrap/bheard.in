"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/admin/ui/button";

export default function DeleteEntityButton({
  endpoint,
  redirectTo,
  label = "Delete",
}: {
  endpoint: string;
  redirectTo: string;
  label?: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const remove = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;
    setLoading(true);
    const res = await fetch(endpoint, { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      router.push(redirectTo);
      router.refresh();
    }
  };

  return (
    <Button variant="destructive" onClick={remove} disabled={loading}>
      {loading ? "Deleting..." : label}
    </Button>
  );
}
