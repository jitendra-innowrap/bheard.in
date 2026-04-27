"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/admin/ui/input";
import { Select } from "@/components/admin/ui/select";
import { Button } from "@/components/admin/ui/button";

export type FilterOption = { label: string; value: string };

type FilterBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  status?: string;
  onStatusChange?: (value: string) => void;
  statusOptions?: FilterOption[];
  category?: string;
  onCategoryChange?: (value: string) => void;
  categoryOptions?: FilterOption[];
  sort?: string;
  onSortChange?: (value: string) => void;
  sortOptions?: FilterOption[];
  onReset: () => void;
};

export function FilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  statusOptions,
  category,
  onCategoryChange,
  categoryOptions,
  sort,
  onSortChange,
  sortOptions,
  onReset,
}: FilterBarProps) {
  return (
    <div className="grid gap-3 rounded-md border border-border bg-card p-4 md:grid-cols-12">
      <div className="relative md:col-span-4">
        <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => onSearchChange(e.target.value)} className="pl-9" placeholder="Search..." />
      </div>
      {statusOptions && onStatusChange ? (
        <Select value={status} onChange={(e) => onStatusChange(e.target.value)} className="md:col-span-2">
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : null}
      {categoryOptions && onCategoryChange ? (
        <Select value={category} onChange={(e) => onCategoryChange(e.target.value)} className="md:col-span-2">
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : null}
      {sortOptions && onSortChange ? (
        <Select value={sort} onChange={(e) => onSortChange(e.target.value)} className="md:col-span-2">
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : null}
      <div className="md:col-span-2">
        <Button variant="outline" className="w-full" onClick={onReset}>
          <X className="h-4 w-4" /> Reset
        </Button>
      </div>
    </div>
  );
}
