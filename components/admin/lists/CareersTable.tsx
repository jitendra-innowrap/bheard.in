"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, CircleOff } from "lucide-react";
import { FilterBar } from "@/components/admin/ui/filter-bar";
import { Pagination } from "@/components/admin/ui/pagination";
import { RowActions } from "@/components/admin/ui/row-actions";
import { tableStyles } from "@/components/admin/ui/styles";
import { Button } from "@/components/admin/ui/button";

type CareerItem = {
  id: string | number;
  slug?: string;
  title: string;
  department: string;
  type: string;
  location: string;
  active: boolean;
  updatedAt?: Date | string;
};

export default function CareersTable({ rows }: { rows: CareerItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(rows);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("updated-desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const result = items.filter((item) => {
      const matchesQ =
        item.title.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q);
      const matchesStatus = status === "all" ? true : status === "active" ? item.active : !item.active;
      return matchesQ && matchesStatus;
    });
    result.sort((a, b) => {
      if (sort === "title-asc") return a.title.localeCompare(b.title);
      if (sort === "title-desc") return b.title.localeCompare(a.title);
      const da = new Date(a.updatedAt ?? 0).getTime();
      const db = new Date(b.updatedAt ?? 0).getTime();
      return sort === "updated-asc" ? da - db : db - da;
    });
    return result;
  }, [items, search, status, sort]);

  const toggleActive = async (role: CareerItem) => {
    if (!role.slug) return;
    const nextActive = !role.active;
    const previousItems = items;
    setItems(items.map((item) => (item.id === role.id ? { ...item, active: nextActive } : item)));
    const res = await fetch(`/api/careers/${role.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: nextActive }),
    });
    if (!res.ok) {
      setItems(previousItems);
      return;
    }
    router.refresh();
  };

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div className="space-y-4">
      <FilterBar
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        status={status}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        statusOptions={[
          { label: "All statuses", value: "all" },
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" },
        ]}
        sort={sort}
        onSortChange={(value) => setSort(value)}
        sortOptions={[
          { label: "Latest updated", value: "updated-desc" },
          { label: "Oldest updated", value: "updated-asc" },
          { label: "Title A-Z", value: "title-asc" },
          { label: "Title Z-A", value: "title-desc" },
        ]}
        onReset={() => {
          setSearch("");
          setStatus("all");
          setSort("updated-desc");
          setPage(1);
        }}
        showReset={Boolean(search || status !== "all" || sort !== "updated-desc")}
      />
      <div className={tableStyles.wrapper}>
        <table className={tableStyles.table}>
          <thead>
            <tr className={tableStyles.headRow}>
              <th className={tableStyles.headCell}>Serial</th>
              <th className={tableStyles.headCell}>Role</th>
              <th className={tableStyles.headCell}>Department</th>
              <th className={tableStyles.headCell}>Type / Location</th>
              <th className={tableStyles.headCell}>Status</th>
              <th className={tableStyles.headCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.length ? (
              paged.map((role, idx) => (
                <tr key={role.id} className={tableStyles.row}>
                  <td className={tableStyles.cell}>{(safePage - 1) * pageSize + idx + 1}</td>
                  <td className={tableStyles.cell}>{role.title}</td>
                  <td className={tableStyles.cell}>
                    <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      {role.department}
                    </span>
                  </td>
                  <td className={tableStyles.cell}>
                    {role.type} · {role.location}
                  </td>
                  <td className={tableStyles.cell}>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        role.active
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200"
                      }`}
                    >
                      {role.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className={tableStyles.cell}>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 px-2.5 text-xs"
                        onClick={() => toggleActive(role)}
                        disabled={!role.slug}
                      >
                        {role.active ? <CircleOff className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                        {role.active ? "Deactivate" : "Activate"}
                      </Button>
                      <RowActions editHref={`/admin/careers/${role.id}/edit`} detailHref={`/admin/careers/${role.id}`} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-10 text-center text-muted-foreground" colSpan={6}>
                  No roles found for current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        page={safePage}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </div>
  );
}
