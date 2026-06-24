import { Ambulance, Crosshair, MapPin } from "lucide-react";
import { cn } from "../../lib/utils";

interface LiveAmbulanceMapProps {
  etaMinutes: number;
  progress?: number;
  className?: string;
}

export function LiveAmbulanceMap({ etaMinutes, progress = 42, className }: LiveAmbulanceMapProps) {
  const safeProgress = Math.min(88, Math.max(12, progress));

  return (
    <div className={cn("relative min-h-[360px] overflow-hidden rounded-lg border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-900", className)}>
      <iframe
        title="OpenStreetMap live ambulance tracking"
        className="absolute inset-0 h-full w-full border-0 grayscale-[0.15]"
        src="https://www.openstreetmap.org/export/embed.html?bbox=32.5450%2C0.3150%2C32.6200%2C0.3800&layer=mapnik&marker=0.3476%2C32.5825"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-white/10" />
      <div className="absolute left-[18%] top-[62%] grid h-12 w-12 place-items-center rounded-full bg-white text-clinical-700 shadow-soft dark:bg-slate-950 dark:text-clinical-300">
        <MapPin aria-hidden="true" size={24} />
        <span className="absolute -bottom-6 whitespace-nowrap rounded-full bg-slate-950 px-2 py-1 text-xs font-semibold text-white">
          Pickup
        </span>
      </div>
      <div
        className="absolute grid h-14 w-14 place-items-center rounded-full bg-alert-600 text-white shadow-soft transition-all duration-700"
        style={{ left: `${safeProgress}%`, top: `${80 - safeProgress * 0.55}%` }}
      >
        <span className="absolute inset-0 rounded-full bg-alert-500/50 animate-pulseRing" />
        <Ambulance aria-hidden="true" size={26} className="relative" />
      </div>
      <div className="absolute right-4 top-4 rounded-lg bg-white/92 p-3 shadow-soft dark:bg-slate-950/90">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white">
          <Crosshair size={18} className="text-clinical-700 dark:text-clinical-300" aria-hidden="true" />
          Live tracking
        </div>
        <p className="mt-1 text-2xl font-bold text-alert-600 dark:text-alert-300">{etaMinutes} min</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Estimated arrival</p>
      </div>
    </div>
  );
}
