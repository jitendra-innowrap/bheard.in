"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, CircleOff } from "lucide-react";
import { Pagination } from "@/components/admin/ui/pagination";
import { FilterBar } from "@/components/admin/ui/filter-bar";
import { RowActions } from "@/components/admin/ui/row-actions";
import { tableStyles } from "@/components/admin/ui/styles";
import { Button } from "@/components/admin/ui/button";

type BlogItem = {
  id: string | number;
  slug: string;
  title: string;
  category: string;
  published: boolean;
  publishedAt: Date | string | null;
  updatedAt?: Date | string;
};

export default function BlogsTable({ rows }: { rows: BlogItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(rows);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("updated-desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(items.map((item) => item.category)))],
    [items]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const result = items.filter((item) => {
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
  }, [items, search, status, category, sort]);

  const togglePublish = async (post: BlogItem) => {
    const nextPublished = !post.published;
    const previousItems = items;
    const optimistic = items.map((item) =>
      item.id === post.id ? { ...item, published: nextPublished, publishedAt: nextPublished ? new Date() : null } : item
    );
    setItems(optimistic);
    const res = await fetch(`/api/blog/${post.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: nextPublished, publishedAt: nextPublished ? new Date().toISOString() : null }),
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
        showReset={Boolean(search || status !== "all" || category !== "all" || sort !== "updated-desc")}
      />

      <div className={tableStyles.wrapper}>
        <table className={tableStyles.table}>
          <thead>
            <tr className={tableStyles.headRow}>
              <th className={tableStyles.headCell}>Serial</th>
              <th className={tableStyles.headCell}>Title</th>
              <th className={tableStyles.headCell}>Category</th>
              <th className={tableStyles.headCell}>Status</th>
              <th className={tableStyles.headCell}>Updated</th>
              <th className={tableStyles.headCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.length ? (
              paged.map((post, idx) => (
                <tr key={post.id} className={tableStyles.row}>
                  <td className={tableStyles.cell}>{(safePage - 1) * pageSize + idx + 1}</td>
                  <td className={tableStyles.cell}>
                    <Link href={`/admin/blog/${post.id}`} className="font-medium hover:underline">
                      {post.title}
                    </Link>
                  </td>
                  <td className={tableStyles.cell}>
                    <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      {post.category}
                    </span>
                  </td>
                  <td className={tableStyles.cell}>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        post.published
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className={tableStyles.cell}>
                    {new Date(post.updatedAt ?? post.publishedAt ?? Date.now()).toLocaleDateString()}
                  </td>
                  <td className={tableStyles.cell}>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1.5 px-2.5 text-xs"
                        onClick={() => togglePublish(post)}
                      >
                        {post.published ? <CircleOff className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                        {post.published ? "Unpublish" : "Publish"}
                      </Button>
                      <RowActions editHref={`/admin/blog/${post.id}/edit`} detailHref={`/admin/blog/${post.id}`} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-10 text-center text-muted-foreground" colSpan={6}>
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
