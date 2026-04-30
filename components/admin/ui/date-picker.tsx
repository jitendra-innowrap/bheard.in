"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { Button } from "@/components/admin/ui/button";
import { Calendar } from "@/components/admin/ui/calendar";
import { cn } from "@/lib/utils";

type DatePickerProps = {
  value: string | null;
  onChange: (value: string | null) => void;
};

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selectedDate = value ? new Date(value) : undefined;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn("w-[240px] justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? format(selectedDate, "PPP") : "Pick publish date"}
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          className="z-50 rounded-md border border-border bg-popover p-0 shadow-md"
          sideOffset={8}
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (!date) {
                onChange(null);
              } else {
                const next = new Date(date);
                next.setHours(12, 0, 0, 0);
                onChange(next.toISOString());
              }
              setOpen(false);
            }}
          />
          {selectedDate ? (
            <div className="border-t border-border p-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
                Clear
              </Button>
            </div>
          ) : null}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

