"use client";

import { Search, Trash2 } from "lucide-react";
import { Input } from "@/components/admin/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/admin/ui/select";
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
  showReset?: boolean;
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
  showReset = false,
}: FilterBarProps) {
  return (
    <div className="grid gap-3 rounded-md border border-border bg-card p-4 md:grid-cols-12">
      <div className="relative md:col-span-4">
        <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => onSearchChange(e.target.value)} className="pl-9" placeholder="Search..." />
      </div>
      {statusOptions && onStatusChange ? (
        <div className="md:col-span-2">
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}
      {categoryOptions && onCategoryChange ? (
        <div className="md:col-span-2">
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}
      {sortOptions && onSortChange ? (
        <div className="md:col-span-2">
          <Select value={sort} onValueChange={onSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}
      {showReset ? (
        <div className="md:col-span-2">
          <Button variant="outline" className="w-full" onClick={onReset} aria-label="Clear filters">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
