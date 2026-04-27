"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Pagination } from "@/components/admin/ui/pagination";
import { FilterBar } from "@/components/admin/ui/filter-bar";
import { RowActions } from "@/components/admin/ui/row-actions";
import { tableStyles } from "@/components/admin/ui/styles";

type BlogItem = {
  id: number;
  slug: string;
  title: string;
  category: string;
  published: boolean;
  publishedAt: Date | string | null;
  updatedAt?: Date | string;
};

export default function BlogsTable({ rows }: { rows: BlogItem[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("updated-desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(rows.map((item) => item.category)))],
    [rows]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const result = rows.filter((item) => {
      const matchesQ = item.title.toLowerCase().includes(q) || item.slug.toLowerCase().includes(q);
      const matchesStatus =
        status === "all" ? true : status === "published" ? item.published : !item.published;
      const matchesCategory = category === "all" ? true : item.category === category;
      return matchesQ && matchesStatus && matchesCategory;
    });

    result.sort((a, b) => {
      if (sort === "title-asc") return a.title.localeCompare(b.title);
      if (sort === "title-desc") return b.title.localeCompare(a.title);
      const da = new Date(a.updatedAt ?? a.publishedAt ?? 0).getTime();
      const db = new Date(b.updatedAt ?? b.publishedAt ?? 0).getTime();
      return sort === "updated-asc" ? da - db : db - da;
    });
    return result;
  }, [rows, search, status, category, sort]);

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
          { label: "Published", value: "published" },
          { label: "Draft", value: "draft" },
        ]}
        category={category}
        onCategoryChange={(value) => {
          setCategory(value);
          setPage(1);
        }}
        categoryOptions={categories.map((item) => ({ label: item === "all" ? "All categories" : item, value: item }))}
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
          setCategory("all");
          setSort("updated-desc");
          setPage(1);
        }}
      />

      <div className={tableStyles.wrapper}>
        <table className={tableStyles.table}>
          <thead>
            <tr className={tableStyles.headRow}>
              <th className={tableStyles.headCell}>Title</th>
              <th className={tableStyles.headCell}>Category</th>
              <th className={tableStyles.headCell}>Status</th>
              <th className={tableStyles.headCell}>Updated</th>
              <th className={tableStyles.headCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.length ? (
              paged.map((post) => (
                <tr key={post.id} className={tableStyles.row}>
                  <td className={tableStyles.cell}>
                    <Link href={`/admin/blog/${post.id}`} className="font-medium hover:underline">
                      {post.title}
                    </Link>
                  </td>
                  <td className={tableStyles.cell}>{post.category}</td>
                  <td className={tableStyles.cell}>{post.published ? "Published" : "Draft"}</td>
                  <td className={tableStyles.cell}>
                    {new Date(post.updatedAt ?? post.publishedAt ?? Date.now()).toLocaleDateString()}
                  </td>
                  <td className={tableStyles.cell}>
                    <RowActions editHref={`/admin/blog/${post.id}/edit`} detailHref={`/admin/blog/${post.id}`} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-10 text-center text-muted-foreground" colSpan={5}>
                  No blog posts found for current filters.
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
