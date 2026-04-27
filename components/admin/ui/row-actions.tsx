"use client";

import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/admin/ui/button";

type RowActionsProps = {
  editHref: string;
  detailHref?: string;
  onDelete?: () => void;
};

export function RowActions({ editHref, detailHref, onDelete }: RowActionsProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className="z-50 min-w-[140px] rounded-md border border-border bg-popover p-1 shadow-md"
        >
          {detailHref ? (
            <DropdownMenu.Item asChild>
              <Link className="block rounded-sm px-3 py-2 text-sm hover:bg-accent" href={detailHref}>
                View details
              </Link>
            </DropdownMenu.Item>
          ) : null}
          <DropdownMenu.Item asChild>
            <Link className="block rounded-sm px-3 py-2 text-sm hover:bg-accent" href={editHref}>
              Edit
            </Link>
          </DropdownMenu.Item>
          {onDelete ? (
            <DropdownMenu.Item
              onSelect={(e) => {
                e.preventDefault();
                onDelete();
              }}
              className="rounded-sm px-3 py-2 text-sm text-destructive hover:bg-accent"
            >
              Delete
            </DropdownMenu.Item>
          ) : null}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
