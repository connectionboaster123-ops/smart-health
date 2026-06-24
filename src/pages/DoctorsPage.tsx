import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, CheckCircle2, MapPin, Search, Star, Stethoscope, Video } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input, Select } from "../components/ui/Input";
import { getDoctors, specialties } from "../lib/data";
import { formatCurrency, formatDateTime } from "../lib/utils";
import type { Doctor } from "../types";

export function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialty, setSpecialty] = useState("All specialties");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    void getDoctors(specialty).then((items) => {
      setDoctors(items);
      setLoading(false);
    });
  }, [specialty]);

  const filteredDoctors = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return doctors;
    }

    return doctors.filter((doctor) =>
      [doctor.name, doctor.title, doctor.hospital, ...doctor.specialties]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [doctors, query]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-lg bg-slate-950 p-6 text-white shadow-soft sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <Badge tone="success" className="bg-white/10 text-white ring-white/20">
              Verified specialists
            </Badge>
            <h1 className="mt-4 text-4xl font-black sm:text-5xl">Find the right doctor faster.</h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Search by specialty, compare ratings and fees, then book clinic, home, or telemedicine appointments.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Input
              label="Search doctors"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, hospital, specialty"
            />
            <Select label="Specialty" value={specialty} onChange={(event) => setSpecialty(event.target.value)}>
              <option>All specialties</option>
              {specialties.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Select>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <Search size={18} aria-hidden="true" className="text-clinical-700 dark:text-clinical-300" />
            {loading ? "Searching verified doctors..." : `${filteredDoctors.length} doctors available`}
          </div>
          <Link to="/book-doctor">
            <Button variant="outline" leftIcon={<CalendarDays size={18} aria-hidden="true" />}>
              Start booking
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="p-0">
              <div className="grid gap-0 md:grid-cols-[220px_1fr]">
                <img src={doctor.avatarUrl} alt={doctor.name} className="h-64 w-full rounded-t-lg object-cover md:h-full md:rounded-l-lg md:rounded-tr-none" />
                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-black text-slate-950 dark:text-white">{doctor.name}</h2>
                        {doctor.verified ? <CheckCircle2 className="text-clinical-700 dark:text-clinical-300" size={19} aria-label="Verified doctor" /> : null}
                      </div>
                      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{doctor.title}</p>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
                      <Star size={16} fill="currentColor" aria-hidden="true" />
                      {doctor.rating} ({doctor.reviewCount})
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {doctor.specialties.map((item) => (
                      <Badge key={item} tone="info">
                        {item}
                      </Badge>
                    ))}
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{doctor.bio}</p>

                  <div className="mt-5 grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
                    <span className="flex items-center gap-2">
                      <MapPin size={17} aria-hidden="true" className="text-clinical-700 dark:text-clinical-300" />
                      {doctor.distanceKm} km away
                    </span>
                    <span className="flex items-center gap-2">
                      <CalendarDays size={17} aria-hidden="true" className="text-clinical-700 dark:text-clinical-300" />
                      {formatDateTime(doctor.nextAvailable)}
                    </span>
                    <span className="flex items-center gap-2">
                      <Stethoscope size={17} aria-hidden="true" className="text-clinical-700 dark:text-clinical-300" />
                      {formatCurrency(doctor.consultationFee)}
                    </span>
                    <span className="flex items-center gap-2">
                      <Video size={17} aria-hidden="true" className="text-clinical-700 dark:text-clinical-300" />
                      {doctor.telemedicine ? "Video visits" : "Clinic visits"}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                    <Link className="flex-1" to={`/book-doctor?doctor=${doctor.id}`}>
                      <Button className="w-full" leftIcon={<CalendarDays size={18} aria-hidden="true" />}>
                        Book appointment
                      </Button>
                    </Link>
                    <Button className="flex-1" variant="secondary" leftIcon={<Video size={18} aria-hidden="true" />} disabled={!doctor.telemedicine}>
                      Video consult
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
