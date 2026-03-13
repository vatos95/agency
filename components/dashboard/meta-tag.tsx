import { cn } from "@/lib/utils";

type MetaTagTone =
  | "default"
  | "accent"
  | "urgent"
  | "success"
  | "warning"
  | "violet";

const toneStyles: Record<MetaTagTone, string> = {
  default:
    "border-border bg-muted/50 text-muted-foreground",
  accent:
    "border-primary/25 bg-primary/12 text-primary",
  urgent:
    "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400",
  success:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warning:
    "border-primary/18 bg-primary/8 text-primary/90",
  violet:
    "border-primary/25 bg-primary/12 text-primary",
};

interface MetaTagProps {
  label: string;
  tone?: MetaTagTone;
  className?: string;
}

export function MetaTag({
  label,
  tone = "default",
  className,
}: MetaTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium leading-none",
        toneStyles[tone],
        className
      )}
    >
      {label}
    </span>
  );
}
