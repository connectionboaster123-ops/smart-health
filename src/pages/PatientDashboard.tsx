import { Link } from "react-router-dom";
import {
  Ambulance,
  CalendarDays,
  ChevronRight,
  FileText,
  HeartPulse,
  MapPin,
  MessageCircle,
  Pill,
  Plus,
  Stethoscope,
  Video
} from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle } from "../components/ui/Card";
import { StatCard } from "../components/ui/StatCard";
import { NotificationPanel } from "../components/dashboard/NotificationPanel";
import { LiveAmbulanceMap } from "../components/maps/LiveAmbulanceMap";
import {
  demoAmbulanceRequests,
  demoAppointments,
  demoMedicalRecords,
  demoNotifications,
  demoPayments,
  patientMetrics
} from "../lib/data";
import { formatCurrency, formatDateTime } from "../lib/utils";
import { useAuth } from "../context/AuthContext";

const quickActions = [
  { label: "Request ambulance", href: "/ambulance", icon: Ambulance, variant: "danger" as const },
  { label: "Book doctor", href: "/book-doctor", icon: Stethoscope, variant: "primary" as const },
  { label: "Video consult", href: "/book-doctor?type=video", icon: Video, variant: "secondary" as const },
  { label: "Message care team", href: "/settings", icon: MessageCircle, variant: "outline" as const }
];

export function PatientDashboard() {
  const { profile } = useAuth();
  const activeRequest = demoAmbulanceRequests[0];

  return (
    <div className="grid gap-6">
      <section className="rounded-lg bg-slate-950 p-6 text-white shadow-soft sm:p-8">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <Badge tone="danger" className="bg-white/10 text-white ring-white/20">
              Emergency SOS available
            </Badge>
            <h2 className="mt-4 text-3xl font-black">Welcome back, {profile?.fullName.split(" ")[0] ?? "Patient"}</h2>
            <p className="mt-2 max-w-2xl text-slate-300">
              Your ambulance requests, appointments, records, prescriptions, and notifications are coordinated here.
            </p>
          </div>
          <Link to="/ambulance">
            <Button variant="danger" size="lg" leftIcon={<HeartPulse size={20} aria-hidden="true" />}>
              Emergency SOS
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {patientMetrics.map((metric) => (
          <StatCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Quick actions</CardTitle>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Start the most common patient workflows.</p>
              </div>
              <Plus className="text-clinical-700 dark:text-clinical-300" size={21} aria-hidden="true" />
            </CardHeader>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.label} to={action.href}>
                    <Button variant={action.variant} className="h-24 w-full flex-col gap-2" leftIcon={<Icon size={22} aria-hidden="true" />}>
                      {action.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Active ambulance request</CardTitle>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Live status, ETA, and pickup details.</p>
              </div>
              <Badge tone="danger">{activeRequest.status}</Badge>
            </CardHeader>
            <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="grid content-start gap-3">
                <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-lg bg-alert-50 text-alert-700 dark:bg-alert-950/40 dark:text-alert-200">
                      <Ambulance size={22} aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-bold text-slate-950 dark:text-white">{activeRequest.providerName}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{activeRequest.vehicleNumber}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 text-sm">
                    <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <MapPin size={17} aria-hidden="true" className="text-clinical-700 dark:text-clinical-300" />
                      {activeRequest.pickupAddress}
                    </p>
                    <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <CalendarDays size={17} aria-hidden="true" className="text-clinical-700 dark:text-clinical-300" />
                      {formatDateTime(activeRequest.requestedAt)}
                    </p>
                    <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Pill size={17} aria-hidden="true" className="text-clinical-700 dark:text-clinical-300" />
                      {formatCurrency(activeRequest.fareEstimate)} authorized
                    </p>
                  </div>
                </div>
                <Link to="/ambulance">
                  <Button className="w-full" rightIcon={<ChevronRight size={18} aria-hidden="true" />}>
                    Open tracking
                  </Button>
                </Link>
              </div>
              <LiveAmbulanceMap etaMinutes={activeRequest.etaMinutes} progress={54} />
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming appointments</CardTitle>
                <CalendarDays className="text-clinical-700 dark:text-clinical-300" size={21} aria-hidden="true" />
              </CardHeader>
              <div className="space-y-3">
                {demoAppointments.map((appointment) => (
                  <article key={appointment.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                    <div className="flex items-start gap-3">
                      <img src={appointment.doctorAvatar} alt={appointment.doctorName} className="h-12 w-12 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-950 dark:text-white">{appointment.doctorName}</h3>
                          <Badge>{appointment.status}</Badge>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{appointment.specialty}</p>
                        <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">{formatDateTime(appointment.scheduledFor)}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Medical history</CardTitle>
                <FileText className="text-clinical-700 dark:text-clinical-300" size={21} aria-hidden="true" />
              </CardHeader>
              <div className="space-y-3">
                {demoMedicalRecords.map((record) => (
                  <article key={record.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-slate-950 dark:text-white">{record.title}</h3>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{record.summary}</p>
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{record.clinician}</p>
                      </div>
                      <Badge tone="neutral">{record.type}</Badge>
                    </div>
                  </article>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <aside className="grid content-start gap-6">
          <NotificationPanel notifications={demoNotifications} />
          <Card>
            <CardHeader>
              <CardTitle>Recent payments</CardTitle>
              <Pill className="text-clinical-700 dark:text-clinical-300" size={21} aria-hidden="true" />
            </CardHeader>
            <div className="space-y-3">
              {demoPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                  <div>
                    <p className="font-bold text-slate-950 dark:text-white">{payment.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{formatDateTime(payment.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-950 dark:text-white">{formatCurrency(payment.amount)}</p>
                    <Badge>{payment.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </section>
    </div>
  );
}
