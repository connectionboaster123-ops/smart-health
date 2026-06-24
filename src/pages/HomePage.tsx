import { Link } from "react-router-dom";
import {
  Ambulance,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  HeartPulse,
  MapPin,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Star,
  Stethoscope,
  Video
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { demoDoctors, faqs, testimonials } from "../lib/data";
import { formatCurrency, formatDateTime } from "../lib/utils";
import type { LucideIcon } from "lucide-react";

const heroImage =
  "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1800&q=80";

const stats = [
  { value: "8 min", label: "Average ambulance ETA" },
  { value: "4.9/5", label: "Patient satisfaction" },
  { value: "24/7", label: "Emergency coverage" },
  { value: "1,200+", label: "Verified care providers" }
];

const steps = [
  {
    icon: MapPin,
    title: "Share location",
    text: "MediRescue captures pickup details and shows nearby available ambulances."
  },
  {
    icon: ShieldCheck,
    title: "Match verified care",
    text: "Patients book trusted doctors or connect with licensed emergency providers."
  },
  {
    icon: Clock3,
    title: "Track every update",
    text: "Live ETA, status changes, payments, records, and notifications stay in one place."
  }
];

const heroFeatures: Array<{ label: string; icon: LucideIcon }> = [
  { label: "Secure payments", icon: ShieldCheck },
  { label: "Video consultation", icon: Video },
  { label: "Care team chat", icon: MessageCircle }
];

export function HomePage() {
  return (
    <main>
      <section
        className="relative isolate min-h-[82svh] overflow-hidden bg-slate-950"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(2, 6, 23, 0.88) 0%, rgba(15, 23, 42, 0.68) 48%, rgba(15, 118, 110, 0.24) 100%), url(${heroImage})`,
          backgroundPosition: "center",
          backgroundSize: "cover"
        }}
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8 lg:py-20">
          <div className="flex max-w-3xl flex-col justify-center">
            <Badge tone="danger" className="w-fit bg-white/12 text-white ring-white/25">
              Emergency-ready care
            </Badge>
            <h1 className="mt-5 max-w-3xl text-5xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
              MediRescue
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-100">
              Hire ambulances, book verified doctors, request emergency medical support, and track critical care from one secure healthcare command center.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/ambulance">
                <Button size="lg" variant="danger" leftIcon={<Ambulance size={21} aria-hidden="true" />} className="w-full sm:w-auto">
                  Request Ambulance
                </Button>
              </Link>
              <Link to="/book-doctor">
                <Button size="lg" variant="secondary" leftIcon={<Stethoscope size={21} aria-hidden="true" />} className="w-full sm:w-auto">
                  Book a Doctor
                </Button>
              </Link>
            </div>
            <div className="mt-9 grid gap-3 sm:grid-cols-3">
              {heroFeatures.map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                  <Icon size={18} aria-hidden="true" className="text-clinical-200" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="self-end rounded-lg border border-white/20 bg-white/12 p-4 text-white shadow-soft backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3 border-b border-white/15 pb-4">
              <div>
                <p className="text-sm font-semibold text-clinical-100">Live emergency desk</p>
                <h2 className="mt-1 text-2xl font-black">Critical pickup assigned</h2>
              </div>
              <span className="relative grid h-14 w-14 place-items-center rounded-full bg-alert-600">
                <span className="absolute inset-0 rounded-full bg-alert-500/50 animate-pulseRing" />
                <PhoneCall size={25} aria-hidden="true" className="relative" />
              </span>
            </div>
            <div className="mt-4 grid gap-3">
              <div className="flex items-center justify-between rounded-lg bg-white/10 p-3">
                <span className="text-sm text-slate-100">Nearest ALS unit</span>
                <strong>MR-ALS-204</strong>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/10 p-3">
                <span className="text-sm text-slate-100">Estimated arrival</span>
                <strong>7 min</strong>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/10 p-3">
                <span className="text-sm text-slate-100">Hospital handoff</span>
                <strong>Northwell City</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-3 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((item) => (
          <Card key={item.label} className="p-5">
            <p className="text-3xl font-black text-slate-950 dark:text-white">{item.value}</p>
            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
          </Card>
        ))}
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <Badge tone="info">How it works</Badge>
          <h2 className="mt-4 text-3xl font-black text-slate-950 dark:text-white sm:text-4xl">
            Fast decisions for moments that cannot wait
          </h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.title} className="p-6">
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-clinical-50 text-clinical-700 dark:bg-clinical-950/50 dark:text-clinical-200">
                  <Icon size={24} aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-black text-slate-950 dark:text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{step.text}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-slate-900/45">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Badge tone="success">Featured doctors</Badge>
              <h2 className="mt-4 text-3xl font-black text-slate-950 dark:text-white">Verified specialists ready to help</h2>
            </div>
            <Link to="/doctors">
              <Button variant="outline" rightIcon={<ArrowRight size={18} aria-hidden="true" />}>
                View all doctors
              </Button>
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {demoDoctors.map((doctor) => (
              <Card key={doctor.id} className="overflow-hidden p-0">
                <img src={doctor.avatarUrl} alt={doctor.name} className="h-48 w-full object-cover" />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-black text-slate-950 dark:text-white">{doctor.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{doctor.title}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-bold text-amber-600">
                      <Star size={16} fill="currentColor" aria-hidden="true" />
                      {doctor.rating}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{doctor.hospital}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-slate-950 dark:text-white">{formatCurrency(doctor.consultationFee)}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{formatDateTime(doctor.nextAvailable)}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <Badge tone="neutral">Patient experience</Badge>
          <h2 className="mt-4 text-3xl font-black text-slate-950 dark:text-white">Connected care after the first response</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            MediRescue continues past dispatch with appointment history, prescriptions, medical record storage, chat, video visits, and payment visibility.
          </p>
          <div className="mt-6 grid gap-3">
            {["Appointment history", "Ambulance request history", "Medical records", "In-app notifications"].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <CheckCircle2 className="text-clinical-700 dark:text-clinical-300" size={20} aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="p-5">
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">"{testimonial.quote}"</p>
              <div className="mt-5">
                <p className="font-bold text-slate-950 dark:text-white">{testimonial.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{testimonial.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section id="faq" className="bg-slate-100 py-16 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Badge tone="info">FAQ</Badge>
          <h2 className="mt-4 text-3xl font-black text-slate-950 dark:text-white">Common questions</h2>
          <div className="mt-8 grid gap-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
                <summary className="cursor-pointer text-base font-bold text-slate-950 dark:text-white">{faq.question}</summary>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-slate-950 p-8 text-white shadow-soft lg:flex lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <HeartPulse className="text-clinical-300" aria-hidden="true" />
              <p className="font-bold text-clinical-100">Emergency operations, patient care, and provider workflows</p>
            </div>
            <h2 className="mt-4 text-3xl font-black">Launch a safer healthcare response network.</h2>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-0">
            <Link to="/auth">
              <Button variant="secondary" leftIcon={<CalendarCheck size={18} aria-hidden="true" />} className="w-full sm:w-auto">
                Create account
              </Button>
            </Link>
            <Link to="/ambulance">
              <Button variant="danger" leftIcon={<Ambulance size={18} aria-hidden="true" />} className="w-full sm:w-auto">
                Request care
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
