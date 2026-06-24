import { Activity, AlertTriangle, BarChart3, HeartPulse, ShieldCheck } from "lucide-react";
import type { DashboardMetric } from "../../types";
import { Card } from "./Card";
import { cn } from "../../lib/utils";

const toneStyles = {
  teal: {
    icon: HeartPulse,
    className: "bg-clinical-50 text-clinical-700 dark:bg-clinical-950/40 dark:text-clinical-200"
  },
  blue: {
    icon: Activity,
    className: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-200"
  },
  rose: {
    icon: AlertTriangle,
    className: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-200"
  },
  amber: {
    icon: ShieldCheck,
    className: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-200"
  },
  slate: {
    icon: BarChart3,
    className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
  }
};

export function StatCard({ metric }: { metric: DashboardMetric }) {
  const style = toneStyles[metric.tone];
  const Icon = style.icon;

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{metric.label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{metric.value}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{metric.trend}</p>
        </div>
        <div className={cn("grid h-10 w-10 place-items-center rounded-lg", style.className)}>
          <Icon aria-hidden="true" size={20} />
        </div>
      </div>
    </Card>
  );
}
