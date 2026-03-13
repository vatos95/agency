import { cn } from "@/lib/utils";
import type { MissionStatus } from "@/mock-data/dashboard";

const styles: Record<MissionStatus, { label: string; className: string }> = {
  new: {
    label: "Nouveau",
    className:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  active: {
    label: "En cours",
    className:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  delivery_due: {
    label: "Livraison attendue",
    className:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  revision: {
    label: "Revision demandee",
    className:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  },
  validated: {
    label: "Validee",
    className:
      "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  },
};

export function StatusPill({ status }: { status: MissionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        styles[status].className
      )}
    >
      {styles[status].label}
    </span>
  );
}
