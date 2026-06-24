import { useState } from "react";
import {
  Ambulance,
  Banknote,
  Check,
  Clock3,
  Gauge,
  MapPin,
  Navigation,
  ShieldCheck,
  Upload,
  X
} from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle } from "../components/ui/Card";
import { Input, Select, Textarea } from "../components/ui/Input";
import { LiveAmbulanceMap } from "../components/maps/LiveAmbulanceMap";
import { StatCard } from "../components/ui/StatCard";
import { demoAmbulanceRequests, demoAmbulances, demoPayments, providerMetrics } from "../lib/data";
import { cn, formatCurrency, formatDateTime } from "../lib/utils";
import type { AmbulanceRequestStatus } from "../types";
import { useAuth } from "../context/AuthContext";

type RequestDecision = Record<string, AmbulanceRequestStatus>;

export function AmbulanceProviderDashboard() {
  const { profile } = useAuth();
  const [online, setOnline] = useState(true);
  const [decisions, setDecisions] = useState<RequestDecision>({});

  function setRequestStatus(id: string, status: AmbulanceRequestStatus) {
    setDecisions((current) => ({ ...current, [id]: status }));
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-lg bg-slate-950 p-6 text-white shadow-soft sm:p-8">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <Badge tone="danger" className="bg-white/10 text-white ring-white/20">
              EMS provider workspace
            </Badge>
            <h2 className="mt-4 text-3xl font-black">{profile?.fullName ?? "Dispatch"}, your fleet is live.</h2>
            <p className="mt-2 max-w-2xl text-slate-300">
              Register vehicles, accept emergency requests, stream GPS updates, track trips, and monitor earnings.
            </p>
          </div>
          <button
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition",
              online ? "bg-emerald-50 text-emerald-700" : "bg-slate-800 text-slate-200"
            )}
            onClick={() => setOnline((current) => !current)}
            aria-pressed={online}
          >
            <span className={cn("h-3 w-3 rounded-full", online ? "bg-emerald-500" : "bg-slate-500")} />
            {online ? "Available" : "Offline"}
          </button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {providerMetrics.map((metric) => (
          <StatCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Incoming ambulance requests</CardTitle>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Accept, reject, and dispatch available vehicles.</p>
              </div>
              <Ambulance className="text-alert-600 dark:text-alert-300" size={22} aria-hidden="true" />
            </CardHeader>
            <div className="space-y-3">
              {demoAmbulanceRequests.map((request) => {
                const status = decisions[request.id] ?? request.status;
                return (
                  <article key={request.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-black text-slate-950 dark:text-white">Critical pickup</h3>
                          <Badge tone="danger">{request.priority}</Badge>
                          <Badge>{status}</Badge>
                        </div>
                        <p className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <MapPin size={16} aria-hidden="true" className="text-clinical-700 dark:text-clinical-300" />
                          {request.pickupAddress} to {request.destinationAddress}
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <Clock3 size={16} aria-hidden="true" className="text-clinical-700 dark:text-clinical-300" />
                          Requested {formatDateTime(request.requestedAt)}
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <Button size="sm" variant="secondary" leftIcon={<Check size={16} />} onClick={() => setRequestStatus(request.id, "accepted")}>
                          Accept
                        </Button>
                        <Button size="sm" variant="outline" leftIcon={<X size={16} />} onClick={() => setRequestStatus(request.id, "cancelled")}>
                          Reject
                        </Button>
                        <Button size="sm" leftIcon={<Navigation size={16} />} onClick={() => setRequestStatus(request.id, "driver_en_route")}>
                          Dispatch
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Fleet status</CardTitle>
                <Gauge className="text-clinical-700 dark:text-clinical-300" size={21} aria-hidden="true" />
              </CardHeader>
              <div className="space-y-3">
                {demoAmbulances.map((ambulance) => (
                  <div key={ambulance.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-950 dark:text-white">{ambulance.vehicleNumber}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{ambulance.vehicleType}</p>
                      </div>
                      <Badge tone={ambulance.availability === "available" ? "success" : "neutral"}>
                        {ambulance.availability}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{ambulance.equipment.join(", ")}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vehicle registration</CardTitle>
                <Upload className="text-clinical-700 dark:text-clinical-300" size={21} aria-hidden="true" />
              </CardHeader>
              <div className="grid gap-4">
                <Input label="Vehicle number" defaultValue="MR-ALS-204" />
                <Select label="Vehicle type" defaultValue="Advanced Life Support">
                  <option>Advanced Life Support</option>
                  <option>Basic Life Support</option>
                  <option>Mobile ICU</option>
                  <option>Neonatal Ambulance</option>
                </Select>
                <Textarea label="Equipment" defaultValue="Cardiac monitor, oxygen, defibrillator, ventilator" />
                <Button leftIcon={<ShieldCheck size={18} />}>Submit for verification</Button>
              </div>
            </Card>
          </div>
        </div>

        <aside className="grid content-start gap-6">
          <LiveAmbulanceMap etaMinutes={7} progress={58} />
          <Card>
            <CardHeader>
              <CardTitle>GPS tracking</CardTitle>
              <Navigation className="text-clinical-700 dark:text-clinical-300" size={21} aria-hidden="true" />
            </CardHeader>
            <div className="grid gap-3">
              <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                <p className="font-bold text-slate-950 dark:text-white">MR-ALS-204</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Location refreshed 18 seconds ago</p>
              </div>
              <Button variant="secondary" leftIcon={<Navigation size={18} />}>
                Send current GPS location
              </Button>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Earnings and trips</CardTitle>
              <Banknote className="text-clinical-700 dark:text-clinical-300" size={21} aria-hidden="true" />
            </CardHeader>
            <div className="space-y-3">
              {demoPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                  <div>
                    <p className="font-bold text-slate-950 dark:text-white">{payment.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{payment.status}</p>
                  </div>
                  <p className="font-black text-slate-950 dark:text-white">{formatCurrency(payment.amount)}</p>
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </section>
    </div>
  );
}
