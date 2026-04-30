"use client";

import { useMemo, useState } from "react";
import { FilterBar } from "@/components/admin/ui/filter-bar";
import { Pagination } from "@/components/admin/ui/pagination";
import { RowActions } from "@/components/admin/ui/row-actions";
import { tableStyles } from "@/components/admin/ui/styles";

type CareerItem = {
  id: number;
  title: string;
  department: string;
  type: string;
  location: string;
  active: boolean;
  updatedAt?: Date | string;
};

export default function CareersTable({ rows }: { rows: CareerItem[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("updated-desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const result = rows.filter((item) => {
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
  }, [rows, search, status, sort]);

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
                  <td className={tableStyles.cell}>{role.department}</td>
                  <td className={tableStyles.cell}>
                    {role.type} · {role.location}
                  </td>
                  <td className={tableStyles.cell}>{role.active ? "Active" : "Inactive"}</td>
                  <td className={tableStyles.cell}>
                    <RowActions editHref={`/admin/careers/${role.id}/edit`} detailHref={`/admin/careers/${role.id}`} />
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
