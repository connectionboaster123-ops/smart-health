import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Ambulance,
  CalendarClock,
  CheckCircle2,
  Clock3,
  CreditCard,
  Crosshair,
  Loader2,
  MapPin,
  Navigation,
  PhoneCall,
  ShieldCheck
} from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle } from "../components/ui/Card";
import { Input, Select, Textarea } from "../components/ui/Input";
import { LiveAmbulanceMap } from "../components/maps/LiveAmbulanceMap";
import { createAmbulanceRequest, getNearbyAmbulances } from "../lib/data";
import { cn, formatCurrency } from "../lib/utils";
import type { AmbulanceRequestStatus, AmbulanceUnit } from "../types";
import { useAuth } from "../context/AuthContext";

const defaultPosition = { lat: 0.3476, lng: 32.5825 };

const flow = [
  "Location",
  "Ambulance",
  "Confirm",
  "Driver accepts",
  "Track",
  "Payment",
  "Complete"
];

export function AmbulanceRequestPage() {
  const [position, setPosition] = useState(defaultPosition);
  const [pickupAddress, setPickupAddress] = useState("742 Lakeview Avenue");
  const [destinationAddress, setDestinationAddress] = useState("Northwell City Hospital");
  const [patientCondition, setPatientCondition] = useState("Shortness of breath and chest discomfort");
  const [requestType, setRequestType] = useState<"instant" | "scheduled">("instant");
  const [scheduledFor, setScheduledFor] = useState("");
  const [ambulances, setAmbulances] = useState<AmbulanceUnit[]>([]);
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState("");
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [requestStatus, setRequestStatus] = useState<AmbulanceRequestStatus>("draft");
  const [eta, setEta] = useState(7);
  const [progress, setProgress] = useState(38);
  const [error, setError] = useState("");
  const { profile } = useAuth();

  useEffect(() => {
    void getNearbyAmbulances(position).then((items) => {
      setAmbulances(items);
      setSelectedAmbulanceId((current) => current || items[0]?.id || "");
      setEta(items[0]?.etaMinutes ?? 7);
    });
  }, [position]);

  useEffect(() => {
    if (!requestId || requestStatus === "completed") {
      return;
    }

    const timer = window.setInterval(() => {
      setProgress((current) => Math.min(88, current + 5));
      setEta((current) => Math.max(1, current - 1));
      setRequestStatus((current) => {
        if (current === "accepted") return "driver_en_route";
        if (current === "driver_en_route" && eta <= 3) return "arrived";
        if (current === "arrived" && eta <= 1) return "in_transit";
        return current;
      });
    }, 3500);

    return () => window.clearInterval(timer);
  }, [eta, requestId, requestStatus]);

  const selectedAmbulance = useMemo(
    () => ambulances.find((ambulance) => ambulance.id === selectedAmbulanceId) ?? ambulances[0],
    [ambulances, selectedAmbulanceId]
  );

  const currentStep = requestId ? (requestStatus === "completed" ? 6 : requestStatus === "draft" ? 0 : requestStatus === "pending" ? 2 : 4) : 1;
  const fareEstimate = selectedAmbulance ? 65 + selectedAmbulance.distanceKm * 18 : 95;

  function captureLocation() {
    setLocating(true);
    setError("");

    if (!navigator.geolocation) {
      setLocating(false);
      setError("Geolocation is not available in this browser. Demo coordinates are being used.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (location) => {
        setPosition({
          lat: location.coords.latitude,
          lng: location.coords.longitude
        });
        setLocating(false);
      },
      () => {
        setError("Location permission was not granted. Demo coordinates are being used.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedAmbulance) {
      setError("No available ambulance selected.");
      return;
    }

    setSubmitting(true);
    setError("");
    setRequestStatus("pending");

    try {
      const result = await createAmbulanceRequest({
        patientId: profile?.id,
        ambulance: selectedAmbulance,
        pickupAddress,
        destinationAddress,
        position,
        scheduledFor: requestType === "scheduled" ? scheduledFor : undefined,
        patientCondition
      });
      setRequestId(result.id);
      setRequestStatus("accepted");
      setEta(selectedAmbulance.etaMinutes);
      setProgress(42);
    } catch (caught) {
      setRequestStatus("draft");
      setError(caught instanceof Error ? caught.message : "Could not create ambulance request.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-lg bg-alert-700 p-6 text-white shadow-soft sm:p-8">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <Badge tone="danger" className="bg-white/12 text-white ring-white/25">
              Emergency ambulance
            </Badge>
            <h1 className="mt-4 text-3xl font-black sm:text-4xl">Request emergency transport now.</h1>
            <p className="mt-2 max-w-2xl text-rose-50">
              Share pickup details, choose a nearby verified unit, track live ETA, and complete payment securely.
            </p>
          </div>
          <a href="tel:911">
            <Button variant="secondary" size="lg" leftIcon={<PhoneCall size={20} aria-hidden="true" />}>
              Call emergency line
            </Button>
          </a>
        </div>
      </section>

      <section className="grid gap-2 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950 sm:grid-cols-7">
        {flow.map((item, index) => (
          <div
            key={item}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold",
              index <= currentStep
                ? "bg-clinical-50 text-clinical-800 dark:bg-clinical-950/40 dark:text-clinical-100"
                : "bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400"
            )}
          >
            {index < currentStep ? <CheckCircle2 size={15} aria-hidden="true" /> : <span>{index + 1}</span>}
            {item}
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <form className="grid gap-6" onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Pickup details</CardTitle>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Location, condition, destination, and schedule.</p>
              </div>
              <Crosshair className="text-clinical-700 dark:text-clinical-300" size={21} aria-hidden="true" />
            </CardHeader>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Pickup address" value={pickupAddress} onChange={(event) => setPickupAddress(event.target.value)} required />
              <Input label="Destination" value={destinationAddress} onChange={(event) => setDestinationAddress(event.target.value)} />
              <Select label="Request type" value={requestType} onChange={(event) => setRequestType(event.target.value as "instant" | "scheduled")}>
                <option value="instant">Instant request</option>
                <option value="scheduled">Schedule ambulance</option>
              </Select>
              <Input
                label="Scheduled time"
                type="datetime-local"
                value={scheduledFor}
                onChange={(event) => setScheduledFor(event.target.value)}
                disabled={requestType === "instant"}
              />
            </div>
            <div className="mt-4">
              <Textarea label="Patient condition" value={patientCondition} onChange={(event) => setPatientCondition(event.target.value)} required />
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Button variant="secondary" onClick={captureLocation} leftIcon={locating ? <Loader2 className="animate-spin" size={18} /> : <Navigation size={18} />} disabled={locating}>
                Capture location
              </Button>
              <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                Lat {position.lat.toFixed(4)}, Lng {position.lng.toFixed(4)}
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Nearby available ambulances</CardTitle>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Verified units sorted by estimated arrival.</p>
              </div>
              <Ambulance className="text-alert-600 dark:text-alert-300" size={22} aria-hidden="true" />
            </CardHeader>
            <div className="grid gap-3">
              {ambulances.map((ambulance) => (
                <button
                  key={ambulance.id}
                  type="button"
                  className={cn(
                    "rounded-lg border p-4 text-left transition",
                    selectedAmbulanceId === ambulance.id
                      ? "border-alert-400 bg-alert-50 shadow-glow dark:bg-alert-950/30"
                      : "border-slate-200 hover:border-clinical-200 dark:border-slate-800"
                  )}
                  onClick={() => {
                    setSelectedAmbulanceId(ambulance.id);
                    setEta(ambulance.etaMinutes);
                  }}
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-black text-slate-950 dark:text-white">{ambulance.providerName}</h3>
                        <Badge tone="success">{ambulance.availability}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{ambulance.vehicleType} · {ambulance.vehicleNumber}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {ambulance.equipment.slice(0, 4).map((item) => (
                          <Badge key={item} tone="neutral">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-1 text-left sm:text-right">
                      <span className="text-2xl font-black text-alert-600 dark:text-alert-300">{ambulance.etaMinutes} min</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{ambulance.distanceKm} km away</span>
                      <span className="text-sm font-bold text-slate-950 dark:text-white">{formatCurrency(65 + ambulance.distanceKm * 18)}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Confirm and pay</CardTitle>
              <CreditCard className="text-clinical-700 dark:text-clinical-300" size={21} aria-hidden="true" />
            </CardHeader>
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-slate-500 dark:text-slate-400">Fare estimate</span>
                <strong className="text-slate-950 dark:text-white">{formatCurrency(fareEstimate)}</strong>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500 dark:text-slate-400">Payment status</span>
                <Badge tone={requestId ? "warning" : "neutral"}>{requestId ? "authorized" : "pending"}</Badge>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500 dark:text-slate-400">Priority</span>
                <Badge tone="danger">critical</Badge>
              </div>
            </div>
            {error ? <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-200">{error}</p> : null}
            <Button type="submit" size="lg" variant="danger" className="mt-5 w-full" disabled={submitting || Boolean(requestId)} leftIcon={submitting ? <Loader2 className="animate-spin" size={18} /> : <Ambulance size={18} />}>
              {requestId ? "Request accepted" : "Confirm ambulance request"}
            </Button>
          </Card>
        </form>

        <aside className="grid content-start gap-6">
          <LiveAmbulanceMap etaMinutes={eta} progress={progress} />
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Live request status</CardTitle>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Driver acceptance, ETA, payment, and completion.</p>
              </div>
              <Badge>{requestStatus}</Badge>
            </CardHeader>
            <div className="grid gap-3">
              {[
                { label: "Patient clicked Request Ambulance", done: true, icon: AlertTriangle },
                { label: "Location captured", done: true, icon: MapPin },
                { label: "Nearby units shown", done: ambulances.length > 0, icon: Ambulance },
                { label: "Patient confirmed request", done: Boolean(requestId), icon: ShieldCheck },
                { label: "Driver accepted", done: Boolean(requestId), icon: CheckCircle2 },
                { label: "Real-time tracking active", done: Boolean(requestId), icon: Crosshair },
                { label: "Payment authorized", done: Boolean(requestId), icon: CreditCard }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                    <span
                      className={cn(
                        "grid h-9 w-9 place-items-center rounded-lg",
                        item.done
                          ? "bg-clinical-50 text-clinical-700 dark:bg-clinical-950/40 dark:text-clinical-200"
                          : "bg-slate-100 text-slate-400 dark:bg-slate-900"
                      )}
                    >
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{item.label}</span>
                  </div>
                );
              })}
            </div>
            {requestId ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Button variant="secondary" leftIcon={<Clock3 size={18} aria-hidden="true" />}>
                  ETA {eta} min
                </Button>
                <Button
                  variant="primary"
                  leftIcon={<CalendarClock size={18} aria-hidden="true" />}
                  onClick={() => setRequestStatus("completed")}
                >
                  Complete trip
                </Button>
              </div>
            ) : null}
          </Card>
        </aside>
      </div>
    </div>
  );
}
