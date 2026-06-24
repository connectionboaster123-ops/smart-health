import { cn, statusTone } from "../../lib/utils";

interface BadgeProps {
  children: string;
  tone?: "success" | "warning" | "danger" | "info" | "neutral";
  className?: string;
}

const toneClasses = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-200 dark:ring-emerald-900",
  warning: "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-200 dark:ring-amber-900",
  danger: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/50 dark:text-rose-200 dark:ring-rose-900",
  info: "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950/50 dark:text-sky-200 dark:ring-sky-900",
  neutral: "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700"
};

export function Badge({ children, tone, className }: BadgeProps) {
  const computedTone = tone ?? statusTone(children);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1",
        toneClasses[computedTone],
        className
      )}
    >
      {children.replace(/_/g, " ")}
    </span>
  );
}
