"use client";

import { useMemo, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/admin/ui/button";
import MediaTable from "@/components/admin/lists/MediaTable";

type MediaItem = {
  id: number;
  filename: string;
  path: string;
  mimeType: string;
  size: number;
  createdAt: Date | string;
};

export default function MediaManager({ initialRows }: { initialRows: MediaItem[] }) {
  const [rows, setRows] = useState(initialRows);
  const [loading, setLoading] = useState(false);

  const orderedRows = useMemo(
    () => [...rows].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [rows]
  );

  const upload = async (file: File) => {
    setLoading(true);
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/media", { method: "POST", body });
    setLoading(false);
    if (!res.ok) return;
    const payload = await res.json();
    setRows((prev) => [payload.data, ...prev]);
  };

  const remove = async (id: number) => {
    const confirmed = window.confirm("Delete this media file?");
    if (!confirmed) return;
    const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    setRows((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-5">
      <div className="rounded-md border border-border bg-card p-4">
        <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-foreground">
          <UploadCloud className="h-4 w-4" />
          {loading ? "Uploading..." : "Upload media asset"}
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              void upload(file);
              e.currentTarget.value = "";
            }}
          />
        </label>
      </div>
      <MediaTable rows={orderedRows} onDelete={remove} />
      <div className="flex justify-end">
        <Button variant="ghost" onClick={() => setRows(initialRows)}>
          Revert local changes
        </Button>
      </div>
    </div>
  );
}
