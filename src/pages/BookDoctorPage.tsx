import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CalendarCheck, CalendarDays, CheckCircle2, CreditCard, Loader2, Star, Video } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle } from "../components/ui/Card";
import { Input, Select, Textarea } from "../components/ui/Input";
import { createAppointment, getDoctors, specialties } from "../lib/data";
import { formatCurrency, formatDateTime } from "../lib/utils";
import type { Doctor } from "../types";
import { useAuth } from "../context/AuthContext";

const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

export function BookDoctorPage() {
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialty, setSpecialty] = useState("All specialties");
  const [doctorId, setDoctorId] = useState(searchParams.get("doctor") ?? "");
  const [visitType, setVisitType] = useState<"clinic" | "home" | "video">(
    searchParams.get("type") === "video" ? "video" : "clinic"
  );
  const [date, setDate] = useState(tomorrow);
  const [time, setTime] = useState("10:30");
  const [reason, setReason] = useState("Urgent consultation and symptom review");
  const [submitting, setSubmitting] = useState(false);
  const [confirmationId, setConfirmationId] = useState("");
  const [error, setError] = useState("");
  const { profile } = useAuth();

  useEffect(() => {
    void getDoctors(specialty).then((items) => {
      setDoctors(items);
      if (!doctorId && items[0]) {
        setDoctorId(items[0].id);
      }
    });
  }, [doctorId, specialty]);

  const selectedDoctor = useMemo(() => doctors.find((doctor) => doctor.id === doctorId) ?? doctors[0], [doctorId, doctors]);
  const scheduledFor = useMemo(() => new Date(`${date}T${time}:00`).toISOString(), [date, time]);
  const serviceFee = selectedDoctor ? Math.round(selectedDoctor.consultationFee * 0.08) : 0;
  const total = selectedDoctor ? selectedDoctor.consultationFee + serviceFee : 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedDoctor) {
      setError("Choose a doctor to continue.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const result = await createAppointment({
        patientId: profile?.id,
        doctorId: selectedDoctor.id,
        scheduledFor,
        visitType,
        reason,
        fee: total
      });
      setConfirmationId(result.id);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not create appointment.");
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmationId && selectedDoctor) {
    return (
      <div className="mx-auto max-w-3xl">
        <Card className="p-8 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">
            <CheckCircle2 size={34} aria-hidden="true" />
          </div>
          <h1 className="mt-5 text-3xl font-black text-slate-950 dark:text-white">Appointment requested</h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-300">
            {selectedDoctor.name} received your booking for {formatDateTime(scheduledFor)}. Confirmation and payment status will appear in notifications.
          </p>
          <div className="mt-6 rounded-lg border border-slate-200 p-4 text-left dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Reference</p>
            <p className="mt-1 font-mono text-sm text-slate-950 dark:text-white">{confirmationId}</p>
          </div>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/patient">
              <Button variant="primary">Patient dashboard</Button>
            </Link>
            <Link to="/doctors">
              <Button variant="secondary">Book another doctor</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-lg bg-slate-950 p-6 text-white shadow-soft sm:p-8">
        <Badge tone="success" className="bg-white/10 text-white ring-white/20">
          Doctor booking
        </Badge>
        <h1 className="mt-4 text-3xl font-black sm:text-4xl">Choose a specialist and reserve care.</h1>
        <p className="mt-2 max-w-2xl text-slate-300">
          Search, select a visit time, authorize payment, and receive confirmation through notifications.
        </p>
      </section>

      <form className="grid gap-6 xl:grid-cols-[1.35fr_0.75fr]" onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>1. Select doctor</CardTitle>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Filter by specialty and compare availability.</p>
              </div>
              <CalendarDays className="text-clinical-700 dark:text-clinical-300" size={21} aria-hidden="true" />
            </CardHeader>
            <div className="grid gap-4 md:grid-cols-2">
              <Select label="Specialty" value={specialty} onChange={(event) => setSpecialty(event.target.value)}>
                <option>All specialties</option>
                {specialties.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Select>
              <Select label="Doctor" value={doctorId} onChange={(event) => setDoctorId(event.target.value)}>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialties[0]}
                  </option>
                ))}
              </Select>
            </div>

            {selectedDoctor ? (
              <article className="mt-5 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <img src={selectedDoctor.avatarUrl} alt={selectedDoctor.name} className="h-28 w-28 rounded-lg object-cover" />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-black text-slate-950 dark:text-white">{selectedDoctor.name}</h2>
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{selectedDoctor.title}</p>
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
                        <Star size={16} fill="currentColor" aria-hidden="true" />
                        {selectedDoctor.rating}
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{selectedDoctor.bio}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedDoctor.specialties.map((item) => (
                        <Badge key={item} tone="info">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ) : null}
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>2. Appointment details</CardTitle>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Pick a time and share the reason for care.</p>
              </div>
              <CalendarCheck className="text-clinical-700 dark:text-clinical-300" size={21} aria-hidden="true" />
            </CardHeader>
            <div className="grid gap-4 md:grid-cols-3">
              <Input label="Date" type="date" min={tomorrow} value={date} onChange={(event) => setDate(event.target.value)} required />
              <Input label="Time" type="time" value={time} onChange={(event) => setTime(event.target.value)} required />
              <Select label="Visit type" value={visitType} onChange={(event) => setVisitType(event.target.value as "clinic" | "home" | "video")}>
                <option value="clinic">Clinic visit</option>
                <option value="home">Home visit</option>
                <option value="video">Video consultation</option>
              </Select>
            </div>
            <div className="mt-4">
              <Textarea label="Reason for visit" value={reason} onChange={(event) => setReason(event.target.value)} required />
            </div>
          </Card>
        </div>

        <aside className="grid content-start gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment summary</CardTitle>
              <CreditCard className="text-clinical-700 dark:text-clinical-300" size={21} aria-hidden="true" />
            </CardHeader>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-slate-500 dark:text-slate-400">Consultation</span>
                <strong className="text-slate-950 dark:text-white">{formatCurrency(selectedDoctor?.consultationFee ?? 0)}</strong>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500 dark:text-slate-400">Service fee</span>
                <strong className="text-slate-950 dark:text-white">{formatCurrency(serviceFee)}</strong>
              </div>
              <div className="border-t border-slate-200 pt-3 dark:border-slate-800">
                <div className="flex justify-between gap-3 text-base">
                  <span className="font-bold text-slate-950 dark:text-white">Total</span>
                  <strong className="text-slate-950 dark:text-white">{formatCurrency(total)}</strong>
                </div>
              </div>
            </div>
            <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
              Payment capture should be handled by a secure Supabase Edge Function connected to a payment provider.
            </div>
            {visitType === "video" ? (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-sky-50 p-3 text-sm font-semibold text-sky-800 dark:bg-sky-950/40 dark:text-sky-100">
                <Video size={18} aria-hidden="true" />
                Video room will be issued after confirmation.
              </div>
            ) : null}
            {error ? <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-200">{error}</p> : null}
            <Button type="submit" size="lg" className="mt-5 w-full" disabled={submitting || !selectedDoctor} leftIcon={submitting ? <Loader2 className="animate-spin" size={18} /> : <CreditCard size={18} />}>
              Authorize and book
            </Button>
          </Card>
        </aside>
      </form>
    </div>
  );
}
