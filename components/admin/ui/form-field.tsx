import { cn } from "@/lib/utils";

export function FormField({
  label,
  helper,
  error,
  children,
}: {
  label: string;
  helper?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
      {error ? <span className="text-xs text-destructive">{error}</span> : null}
      {!error && helper ? <span className={cn("text-xs text-muted-foreground")}>{helper}</span> : null}
    </label>
  );
}
