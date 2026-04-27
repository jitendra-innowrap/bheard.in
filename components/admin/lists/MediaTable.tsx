"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { FilterBar } from "@/components/admin/ui/filter-bar";
import { Pagination } from "@/components/admin/ui/pagination";
import { RowActions } from "@/components/admin/ui/row-actions";
import { tableStyles } from "@/components/admin/ui/styles";

type MediaItem = {
  id: number;
  filename: string;
  path: string;
  mimeType: string;
  size: number;
  createdAt: string | Date;
};

export default function MediaTable({
  rows,
  onDelete,
}: {
  rows: MediaItem[];
  onDelete: (id: number) => Promise<void>;
}) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date-desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const list = rows.filter((item) => item.filename.toLowerCase().includes(q));
    list.sort((a, b) => {
      if (sort === "name-asc") return a.filename.localeCompare(b.filename);
      if (sort === "name-desc") return b.filename.localeCompare(a.filename);
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sort === "date-asc" ? da - db : db - da;
    });
    return list;
  }, [rows, search, sort]);

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
        sort={sort}
        onSortChange={setSort}
        sortOptions={[
          { label: "Newest first", value: "date-desc" },
          { label: "Oldest first", value: "date-asc" },
          { label: "Name A-Z", value: "name-asc" },
          { label: "Name Z-A", value: "name-desc" },
        ]}
        onReset={() => {
          setSearch("");
          setSort("date-desc");
          setPage(1);
        }}
      />
      <div className={tableStyles.wrapper}>
        <table className={tableStyles.table}>
          <thead>
            <tr className={tableStyles.headRow}>
              <th className={tableStyles.headCell}>Preview</th>
              <th className={tableStyles.headCell}>Filename</th>
              <th className={tableStyles.headCell}>Type</th>
              <th className={tableStyles.headCell}>Size</th>
              <th className={tableStyles.headCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.length ? (
              paged.map((asset) => (
                <tr key={asset.id} className={tableStyles.row}>
                  <td className={tableStyles.cell}>
                    {asset.mimeType.startsWith("image/") ? (
                      <Image
                        src={asset.path}
                        alt={asset.filename}
                        width={56}
                        height={40}
                        className="rounded border border-border object-cover"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">File</span>
                    )}
                  </td>
                  <td className={tableStyles.cell}>{asset.filename}</td>
                  <td className={tableStyles.cell}>{asset.mimeType}</td>
                  <td className={tableStyles.cell}>{(asset.size / 1024).toFixed(1)} KB</td>
                  <td className={tableStyles.cell}>
                    <RowActions editHref={asset.path} onDelete={() => void onDelete(asset.id)} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-10 text-center text-muted-foreground" colSpan={5}>
                  No assets found.
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
