"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/admin/ui/button";

type RowActionsProps = {
  editHref: string;
  detailHref?: string;
  onDelete?: () => void;
};

export function RowActions({ editHref, detailHref, onDelete }: RowActionsProps) {
  return (
    <div className="flex items-center gap-1">
      {detailHref ? (
        <Button asChild variant="ghost" size="icon" title="View details" aria-label="View details">
          <Link href={detailHref}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      ) : null}
      <Button asChild variant="ghost" size="icon" title="Edit" aria-label="Edit">
        <Link href={editHref}>
          <Pencil className="h-4 w-4" />
        </Link>
      </Button>
      {onDelete ? (
        <Button
          variant="ghost"
          size="icon"
          title="Delete"
          aria-label="Delete"
          className="text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}
