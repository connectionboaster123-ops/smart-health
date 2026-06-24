import {
  Ambulance,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  FileClock,
  Settings,
  ShieldAlert,
  Stethoscope,
  UsersRound,
  XCircle
} from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle } from "../components/ui/Card";
import { StatCard } from "../components/ui/StatCard";
import {
  adminActivities,
  adminMetrics,
  demoAmbulanceRequests,
  demoAmbulances,
  demoDoctors,
  demoPayments
} from "../lib/data";
import { formatCurrency, formatDateTime } from "../lib/utils";

export function AdminDashboard() {
  return (
    <div className="grid gap-6">
      <section className="rounded-lg bg-slate-950 p-6 text-white shadow-soft sm:p-8">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <Badge tone="danger" className="bg-white/10 text-white ring-white/20">
              Administrator console
            </Badge>
            <h2 className="mt-4 text-3xl font-black">Emergency operations overview</h2>
            <p className="mt-2 max-w-2xl text-slate-300">
              Manage users, verify clinicians and drivers, monitor payments, supervise emergency requests, and review system activity.
            </p>
          </div>
          <Button variant="secondary" leftIcon={<Settings size={19} aria-hidden="true" />}>
            System settings
          </Button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {adminMetrics.map((metric) => (
          <StatCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Verification queue</CardTitle>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Doctors and ambulance providers awaiting review.</p>
              </div>
              <ClipboardCheck className="text-clinical-700 dark:text-clinical-300" size={21} aria-hidden="true" />
            </CardHeader>
            <div className="grid gap-3 lg:grid-cols-2">
              {[
                { name: "Dr. Helena Moore", type: "Doctor", detail: "Neurology · License uploaded", icon: Stethoscope },
                { name: "CityGuard EMS", type: "Ambulance Provider", detail: "3 vehicles · Insurance uploaded", icon: Ambulance }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.name} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                    <div className="flex items-start gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
                        <Icon size={21} aria-hidden="true" />
                      </span>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-black text-slate-950 dark:text-white">{item.name}</h3>
                          <Badge tone="warning">pending</Badge>
                        </div>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.type}</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.detail}</p>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <Button size="sm" leftIcon={<CheckCircle2 size={16} />}>
                            Verify
                          </Button>
                          <Button size="sm" variant="outline" leftIcon={<XCircle size={16} />}>
                            Reject
                          </Button>
                        </div>
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
                <CardTitle>Manage doctors</CardTitle>
                <Stethoscope className="text-clinical-700 dark:text-clinical-300" size={21} aria-hidden="true" />
              </CardHeader>
              <div className="space-y-3">
                {demoDoctors.slice(0, 3).map((doctor) => (
                  <div key={doctor.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <img src={doctor.avatarUrl} alt={doctor.name} className="h-10 w-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-slate-950 dark:text-white">{doctor.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{doctor.specialties[0]}</p>
                      </div>
                    </div>
                    <Badge tone="success">verified</Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Manage ambulance providers</CardTitle>
                <Ambulance className="text-alert-600 dark:text-alert-300" size={21} aria-hidden="true" />
              </CardHeader>
              <div className="space-y-3">
                {demoAmbulances.map((ambulance) => (
                  <div key={ambulance.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                    <div>
                      <p className="font-bold text-slate-950 dark:text-white">{ambulance.providerName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{ambulance.vehicleNumber}</p>
                    </div>
                    <Badge tone={ambulance.availability === "available" ? "success" : "neutral"}>
                      {ambulance.availability}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Emergency requests</CardTitle>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Critical queues and response status.</p>
              </div>
              <ShieldAlert className="text-alert-600 dark:text-alert-300" size={22} aria-hidden="true" />
            </CardHeader>
            <div className="space-y-3">
              {demoAmbulanceRequests.map((request) => (
                <article key={request.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-black text-slate-950 dark:text-white">{request.pickupAddress}</h3>
                        <Badge tone="danger">{request.priority}</Badge>
                        <Badge>{request.status}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {request.providerName} · ETA {request.etaMinutes} min · {formatDateTime(request.requestedAt)}
                      </p>
                    </div>
                    <Button size="sm" variant="danger">
                      Escalate
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </Card>
        </div>

        <aside className="grid content-start gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics and reports</CardTitle>
              <BarChart3 className="text-clinical-700 dark:text-clinical-300" size={21} aria-hidden="true" />
            </CardHeader>
            <div className="grid gap-3">
              {[
                ["Response SLA", "92%", "Critical pickups under 10 minutes"],
                ["Payment success", "98.2%", "Card and mobile money captures"],
                ["Doctor utilization", "74%", "Booked slots this week"]
              ].map(([label, value, detail]) => (
                <div key={label} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-slate-950 dark:text-white">{label}</p>
                    <p className="text-xl font-black text-clinical-700 dark:text-clinical-300">{value}</p>
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{detail}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment management</CardTitle>
              <CreditCard className="text-clinical-700 dark:text-clinical-300" size={21} aria-hidden="true" />
            </CardHeader>
            <div className="space-y-3">
              {demoPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                  <div>
                    <p className="font-bold text-slate-950 dark:text-white">{payment.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{formatDateTime(payment.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-950 dark:text-white">{formatCurrency(payment.amount)}</p>
                    <Badge>{payment.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audit and activity logs</CardTitle>
              <FileClock className="text-clinical-700 dark:text-clinical-300" size={21} aria-hidden="true" />
            </CardHeader>
            <div className="space-y-3">
              {adminActivities.map((activity) => (
                <div key={activity.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-950 dark:text-white">{activity.title}</p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{activity.description}</p>
                    </div>
                    <Badge>{activity.status}</Badge>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{activity.time}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage patients</CardTitle>
              <UsersRound className="text-clinical-700 dark:text-clinical-300" size={21} aria-hidden="true" />
            </CardHeader>
            <div className="grid gap-3">
              {["Amina Carter", "Nora Martinez", "Tariq Evans"].map((patient, index) => (
                <div key={patient} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                  <div>
                    <p className="font-bold text-slate-950 dark:text-white">{patient}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{index + 2} active care records</p>
                  </div>
                  <Badge tone="info">patient</Badge>
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </section>
    </div>
  );
}
