import { useState } from "react";
import {
  Banknote,
  CalendarDays,
  Check,
  ClipboardList,
  Clock3,
  FileText,
  MessageCircle,
  Pill,
  Stethoscope,
  UserRound,
  Video,
  X
} from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle } from "../components/ui/Card";
import { Input, Textarea } from "../components/ui/Input";
import { StatCard } from "../components/ui/StatCard";
import { demoAppointments, demoMedicalRecords, demoPayments, doctorMetrics } from "../lib/data";
import { formatCurrency, formatDateTime } from "../lib/utils";
import type { AppointmentStatus } from "../types";
import { useAuth } from "../context/AuthContext";

type AppointmentDecision = Record<string, AppointmentStatus>;

export function DoctorDashboard() {
  const { profile } = useAuth();
  const [decisions, setDecisions] = useState<AppointmentDecision>({});

  function setStatus(id: string, status: AppointmentStatus) {
    setDecisions((current) => ({ ...current, [id]: status }));
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-lg bg-slate-950 p-6 text-white shadow-soft sm:p-8">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <Badge tone="success" className="bg-white/10 text-white ring-white/20">
              Verified doctor workspace
            </Badge>
            <h2 className="mt-4 text-3xl font-black">Good morning, {profile?.fullName ?? "Doctor"}</h2>
            <p className="mt-2 max-w-2xl text-slate-300">
              Manage appointments, availability, patient information, telemedicine sessions, prescriptions, and earnings.
            </p>
          </div>
          <Button variant="secondary" leftIcon={<Video size={19} aria-hidden="true" />}>
            Open video clinic
          </Button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {doctorMetrics.map((metric) => (
          <StatCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.85fr]">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Appointment management</CardTitle>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Accept, reject, or complete requests.</p>
              </div>
              <CalendarDays className="text-clinical-700 dark:text-clinical-300" size={21} aria-hidden="true" />
            </CardHeader>
            <div className="space-y-3">
              {demoAppointments.map((appointment) => {
                const status = decisions[appointment.id] ?? appointment.status;
                return (
                  <article key={appointment.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                      <div className="flex items-start gap-3">
                        <span className="grid h-12 w-12 place-items-center rounded-lg bg-clinical-50 text-clinical-700 dark:bg-clinical-950/40 dark:text-clinical-200">
                          <UserRound size={22} aria-hidden="true" />
                        </span>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-black text-slate-950 dark:text-white">Amina Carter</h3>
                            <Badge>{status}</Badge>
                          </div>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{appointment.specialty} · {appointment.visitType}</p>
                          <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">{formatDateTime(appointment.scheduledFor)}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <Button variant="secondary" size="sm" leftIcon={<Check size={16} />} onClick={() => setStatus(appointment.id, "confirmed")}>
                          Accept
                        </Button>
                        <Button variant="outline" size="sm" leftIcon={<X size={16} />} onClick={() => setStatus(appointment.id, "rejected")}>
                          Reject
                        </Button>
                        <Button size="sm" leftIcon={<ClipboardList size={16} />} onClick={() => setStatus(appointment.id, "completed")}>
                          Complete
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
                <CardTitle>Availability schedule</CardTitle>
                <Clock3 className="text-clinical-700 dark:text-clinical-300" size={21} aria-hidden="true" />
              </CardHeader>
              <div className="grid gap-3">
                {["Monday", "Tuesday", "Wednesday", "Thursday"].map((day, index) => (
                  <div key={day} className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                    <div>
                      <p className="font-bold text-slate-950 dark:text-white">{day}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{index % 2 === 0 ? "08:00 - 15:00" : "11:00 - 18:00"}</p>
                    </div>
                    <Badge tone="success">active</Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Patient information</CardTitle>
                <FileText className="text-clinical-700 dark:text-clinical-300" size={21} aria-hidden="true" />
              </CardHeader>
              <div className="grid gap-3 text-sm">
                <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                  <p className="font-bold text-slate-950 dark:text-white">Amina Carter</p>
                  <p className="text-slate-500 dark:text-slate-400">Blood group O+ · Allergy: Penicillin</p>
                </div>
                {demoMedicalRecords.map((record) => (
                  <div key={record.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                    <p className="font-bold text-slate-950 dark:text-white">{record.title}</p>
                    <p className="mt-1 text-slate-600 dark:text-slate-300">{record.summary}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <aside className="grid content-start gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile and fees</CardTitle>
              <Stethoscope className="text-clinical-700 dark:text-clinical-300" size={21} aria-hidden="true" />
            </CardHeader>
            <div className="grid gap-4">
              <Input label="Consultation fee" type="number" defaultValue={72} />
              <Input label="Primary specialty" defaultValue="Emergency Medicine" />
              <Textarea label="Qualifications" defaultValue="MD, Emergency Medicine Board Certified, ATLS" />
              <Button leftIcon={<Check size={18} />}>Save profile</Button>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Telemedicine and chat</CardTitle>
              <MessageCircle className="text-clinical-700 dark:text-clinical-300" size={21} aria-hidden="true" />
            </CardHeader>
            <div className="grid gap-3">
              <Button variant="secondary" leftIcon={<Video size={18} />}>
                Start consultation room
              </Button>
              <Button variant="outline" leftIcon={<MessageCircle size={18} />}>
                Open patient chat
              </Button>
              <Button variant="outline" leftIcon={<Pill size={18} />}>
                Create prescription
              </Button>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Earnings dashboard</CardTitle>
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
