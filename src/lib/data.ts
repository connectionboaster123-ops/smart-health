import { isSupabaseConfigured, supabase } from "./supabase";
import type {
  ActivityEvent,
  AmbulanceRequest,
  AmbulanceUnit,
  Appointment,
  DashboardMetric,
  Doctor,
  MedicalRecord,
  NotificationItem,
  PaymentSummary
} from "../types";

const imageParams = "auto=format&fit=crop&w=600&q=80";

function futureDate(hours: number) {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

function pastDate(hours: number) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

export const specialties = [
  "Emergency Medicine",
  "Cardiology",
  "Pediatrics",
  "Neurology",
  "Orthopedics",
  "Dermatology",
  "Obstetrics",
  "Mental Health"
];

export const demoDoctors: Doctor[] = [
  {
    id: "doctor-1",
    name: "Dr. Lina Okafor",
    title: "Emergency Physician",
    avatarUrl: `https://images.unsplash.com/photo-1559839734-2b71ea197ec2?${imageParams}`,
    specialties: ["Emergency Medicine", "Trauma Care"],
    hospital: "Northwell City Hospital",
    rating: 4.9,
    reviewCount: 186,
    consultationFee: 72,
    nextAvailable: futureDate(4),
    distanceKm: 2.4,
    languages: ["English", "French"],
    telemedicine: true,
    verified: true,
    bio: "Emergency physician focused on rapid triage, trauma stabilization, and coordinated care handoffs.",
    qualifications: ["MD", "Emergency Medicine Board Certified", "ATLS"]
  },
  {
    id: "doctor-2",
    name: "Dr. Marcus Reed",
    title: "Consultant Cardiologist",
    avatarUrl: `https://images.unsplash.com/photo-1622253692010-333f2da6031d?${imageParams}`,
    specialties: ["Cardiology", "Internal Medicine"],
    hospital: "St. Anne Heart Institute",
    rating: 4.8,
    reviewCount: 142,
    consultationFee: 95,
    nextAvailable: futureDate(26),
    distanceKm: 5.1,
    languages: ["English", "Spanish"],
    telemedicine: true,
    verified: true,
    bio: "Cardiologist helping patients manage chest pain, hypertension, arrhythmia, and follow-up care.",
    qualifications: ["MD", "FACC", "Echocardiography Fellow"]
  },
  {
    id: "doctor-3",
    name: "Dr. Priya Nair",
    title: "Pediatric Specialist",
    avatarUrl: `https://images.unsplash.com/photo-1594824476967-48c8b964273f?${imageParams}`,
    specialties: ["Pediatrics", "Family Medicine"],
    hospital: "BrightCare Children's Clinic",
    rating: 4.7,
    reviewCount: 121,
    consultationFee: 64,
    nextAvailable: futureDate(8),
    distanceKm: 3.8,
    languages: ["English", "Hindi"],
    telemedicine: true,
    verified: true,
    bio: "Pediatrician with a calm, family-centered approach to urgent symptoms and preventive care.",
    qualifications: ["MBBS", "Pediatrics Residency", "Neonatal Life Support"]
  },
  {
    id: "doctor-4",
    name: "Dr. Ethan Brooks",
    title: "Orthopedic Surgeon",
    avatarUrl: `https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?${imageParams}`,
    specialties: ["Orthopedics", "Sports Medicine"],
    hospital: "Metro Joint and Spine Center",
    rating: 4.6,
    reviewCount: 98,
    consultationFee: 88,
    nextAvailable: futureDate(48),
    distanceKm: 6.7,
    languages: ["English"],
    telemedicine: false,
    verified: true,
    bio: "Orthopedic surgeon for fractures, acute injuries, post-operative review, and mobility recovery plans.",
    qualifications: ["MD", "Orthopedic Surgery", "Arthroscopy Fellowship"]
  }
];

export const demoAmbulances: AmbulanceUnit[] = [
  {
    id: "amb-1",
    providerId: "provider-1",
    providerName: "RapidLine EMS",
    vehicleNumber: "MR-ALS-204",
    vehicleType: "Advanced Life Support",
    etaMinutes: 7,
    distanceKm: 1.8,
    rating: 4.9,
    equipment: ["Cardiac monitor", "Oxygen", "Defibrillator", "Ventilator"],
    availability: "available",
    location: { lat: 0.3476, lng: 32.5825 }
  },
  {
    id: "amb-2",
    providerId: "provider-2",
    providerName: "CareRoute Ambulance",
    vehicleNumber: "MR-BLS-118",
    vehicleType: "Basic Life Support",
    etaMinutes: 11,
    distanceKm: 3.2,
    rating: 4.7,
    equipment: ["Oxygen", "Stretcher", "First aid", "AED"],
    availability: "available",
    location: { lat: 0.3356, lng: 32.5964 }
  },
  {
    id: "amb-3",
    providerId: "provider-3",
    providerName: "Metro Critical Care",
    vehicleNumber: "MR-ICU-331",
    vehicleType: "Mobile ICU",
    etaMinutes: 16,
    distanceKm: 5.4,
    rating: 4.8,
    equipment: ["ICU bed", "Ventilator", "Infusion pumps", "Neonatal kit"],
    availability: "available",
    location: { lat: 0.3599, lng: 32.5736 }
  }
];

export const demoAppointments: Appointment[] = [
  {
    id: "appt-1",
    doctorName: "Dr. Lina Okafor",
    doctorAvatar: demoDoctors[0].avatarUrl,
    specialty: "Emergency Medicine",
    scheduledFor: futureDate(6),
    status: "confirmed",
    visitType: "video",
    fee: 72,
    meetingUrl: "https://meet.medirescue.local/triage"
  },
  {
    id: "appt-2",
    doctorName: "Dr. Marcus Reed",
    doctorAvatar: demoDoctors[1].avatarUrl,
    specialty: "Cardiology",
    scheduledFor: futureDate(72),
    status: "pending",
    visitType: "clinic",
    fee: 95
  }
];

export const demoAmbulanceRequests: AmbulanceRequest[] = [
  {
    id: "req-1",
    status: "driver_en_route",
    priority: "critical",
    providerName: "RapidLine EMS",
    vehicleNumber: "MR-ALS-204",
    etaMinutes: 7,
    pickupAddress: "742 Lakeview Avenue",
    destinationAddress: "Northwell City Hospital",
    requestedAt: pastDate(0.25),
    fareEstimate: 118
  }
];

export const demoNotifications: NotificationItem[] = [
  {
    id: "notice-1",
    title: "Ambulance driver assigned",
    body: "RapidLine EMS accepted your request and is 7 minutes away.",
    read: false,
    createdAt: pastDate(0.1),
    type: "ambulance"
  },
  {
    id: "notice-2",
    title: "Appointment confirmed",
    body: "Your video consultation with Dr. Lina Okafor is confirmed.",
    read: false,
    createdAt: pastDate(2),
    type: "booking"
  },
  {
    id: "notice-3",
    title: "Payment authorized",
    body: "Your card authorization for the ambulance request is complete.",
    read: true,
    createdAt: pastDate(5),
    type: "payment"
  }
];

export const demoMedicalRecords: MedicalRecord[] = [
  {
    id: "record-1",
    title: "Emergency triage note",
    type: "Clinical note",
    date: pastDate(48),
    summary: "Vitals stable after dehydration treatment. Follow-up recommended in 72 hours.",
    clinician: "Dr. Lina Okafor"
  },
  {
    id: "record-2",
    title: "Prescription refill",
    type: "Prescription",
    date: pastDate(168),
    summary: "Antihistamine refill issued with no adverse interactions reported.",
    clinician: "Dr. Priya Nair"
  }
];

export const demoPayments: PaymentSummary[] = [
  {
    id: "pay-1",
    label: "Video consultation",
    amount: 72,
    status: "paid",
    createdAt: pastDate(2)
  },
  {
    id: "pay-2",
    label: "Ambulance authorization",
    amount: 118,
    status: "authorized",
    createdAt: pastDate(0.25)
  }
];

export const patientMetrics: DashboardMetric[] = [
  { label: "Response ETA", value: "7 min", trend: "Live ambulance assigned", tone: "rose" },
  { label: "Upcoming visits", value: "2", trend: "Next consult today", tone: "teal" },
  { label: "Care team", value: "4", trend: "Verified clinicians", tone: "blue" },
  { label: "Records", value: "12", trend: "Encrypted storage", tone: "amber" }
];

export const doctorMetrics: DashboardMetric[] = [
  { label: "Today", value: "14", trend: "4 video consultations", tone: "teal" },
  { label: "Pending", value: "6", trend: "Needs review", tone: "amber" },
  { label: "Rating", value: "4.9", trend: "186 reviews", tone: "blue" },
  { label: "Earnings", value: "$3.8k", trend: "This month", tone: "slate" }
];

export const providerMetrics: DashboardMetric[] = [
  { label: "Open requests", value: "8", trend: "3 critical priority", tone: "rose" },
  { label: "Fleet online", value: "18", trend: "87% availability", tone: "teal" },
  { label: "Avg ETA", value: "8m", trend: "Down 12%", tone: "blue" },
  { label: "Earnings", value: "$9.4k", trend: "This month", tone: "slate" }
];

export const adminMetrics: DashboardMetric[] = [
  { label: "Active emergencies", value: "27", trend: "6 critical", tone: "rose" },
  { label: "Verified doctors", value: "842", trend: "31 pending", tone: "teal" },
  { label: "Ambulances live", value: "184", trend: "42 on route", tone: "blue" },
  { label: "Payments", value: "$128k", trend: "98.2% success", tone: "slate" }
];

export const adminActivities: ActivityEvent[] = [
  {
    id: "act-1",
    title: "Critical emergency escalated",
    description: "Dispatcher assigned Mobile ICU MR-ICU-331.",
    time: "2 min ago",
    status: "danger"
  },
  {
    id: "act-2",
    title: "Doctor verified",
    description: "Credential review completed for neurology specialist.",
    time: "18 min ago",
    status: "success"
  },
  {
    id: "act-3",
    title: "Payment reconciliation",
    description: "Batch payout prepared for 18 service providers.",
    time: "1 hr ago",
    status: "info"
  }
];

export const testimonials = [
  {
    name: "Nora Martinez",
    role: "Patient",
    quote: "The ambulance tracker lowered my panic immediately. I knew who was coming and when."
  },
  {
    name: "Dr. Samuel Grant",
    role: "Emergency physician",
    quote: "MediRescue gives our team the context we need before the patient arrives."
  },
  {
    name: "Tariq Evans",
    role: "Fleet operator",
    quote: "Dispatch, trip history, and payouts finally live in one clean workflow."
  }
];

export const faqs = [
  {
    question: "Can I request an ambulance without choosing a hospital?",
    answer: "Yes. You can request urgent pickup first, then add a destination or let the dispatcher coordinate one."
  },
  {
    question: "Are doctors and ambulance drivers verified?",
    answer: "The schema includes verification workflows, document review, and admin controls for doctors and providers."
  },
  {
    question: "Does MediRescue support telemedicine?",
    answer: "Yes. Doctors can enable video visits, chat, prescriptions, and medical record uploads."
  },
  {
    question: "How are payments handled?",
    answer: "The app includes payment records and UI states. Production card or mobile money capture should run through secure server-side edge functions."
  }
];

type DoctorRow = {
  profile_id: string;
  specialties: string[];
  qualifications: string[];
  hospital_affiliation: string | null;
  consultation_fee: number;
  telemedicine_enabled: boolean;
  rating: number;
  review_count: number;
  biography: string | null;
  profiles?: {
    full_name?: string | null;
    avatar_url?: string | null;
  } | null;
};

export async function getDoctors(specialty?: string): Promise<Doctor[]> {
  if (!isSupabaseConfigured || !supabase) {
    return filterDoctors(demoDoctors, specialty);
  }

  let query = supabase
    .from("doctors")
    .select(
      "profile_id, specialties, qualifications, hospital_affiliation, consultation_fee, telemedicine_enabled, rating, review_count, biography, profiles(full_name, avatar_url)"
    )
    .eq("verification_status", "verified")
    .order("rating", { ascending: false });

  if (specialty) {
    query = query.contains("specialties", [specialty]);
  }

  const { data, error } = await query;

  if (error || !data) {
    return filterDoctors(demoDoctors, specialty);
  }

  return (data as DoctorRow[]).map((row, index) => ({
    id: row.profile_id,
    name: row.profiles?.full_name ?? "Verified Doctor",
    title: row.specialties[0] ? `${row.specialties[0]} Specialist` : "Healthcare Specialist",
    avatarUrl: row.profiles?.avatar_url ?? demoDoctors[index % demoDoctors.length].avatarUrl,
    specialties: row.specialties,
    hospital: row.hospital_affiliation ?? "MediRescue Partner Clinic",
    rating: row.rating,
    reviewCount: row.review_count,
    consultationFee: Number(row.consultation_fee),
    nextAvailable: futureDate(6 + index * 3),
    distanceKm: 2 + index * 1.3,
    languages: ["English"],
    telemedicine: row.telemedicine_enabled,
    verified: true,
    bio: row.biography ?? "Verified clinician available for appointments through MediRescue.",
    qualifications: row.qualifications
  }));
}

export function filterDoctors(doctors: Doctor[], specialty?: string) {
  if (!specialty || specialty === "All specialties") {
    return doctors;
  }

  return doctors.filter((doctor) =>
    doctor.specialties.some((item) => item.toLowerCase().includes(specialty.toLowerCase()))
  );
}

type NearbyAmbulanceRow = {
  ambulance_id: string;
  provider_id: string;
  provider_name: string;
  vehicle_number: string;
  vehicle_type: string;
  equipment: string[];
  distance_meters: number;
  availability_status: AmbulanceUnit["availability"];
};

export async function getNearbyAmbulances(position?: { lat: number; lng: number }) {
  if (!isSupabaseConfigured || !supabase || !position) {
    return demoAmbulances;
  }

  const { data, error } = await supabase.rpc("nearby_ambulances", {
    latitude: position.lat,
    longitude: position.lng,
    radius_meters: 15000,
    result_limit: 10
  });

  if (error || !data) {
    return demoAmbulances;
  }

  return (data as NearbyAmbulanceRow[]).map((row, index) => ({
    id: row.ambulance_id,
    providerId: row.provider_id,
    providerName: row.provider_name,
    vehicleNumber: row.vehicle_number,
    vehicleType: row.vehicle_type,
    etaMinutes: Math.max(4, Math.round(row.distance_meters / 500)),
    distanceKm: Number((row.distance_meters / 1000).toFixed(1)),
    rating: 4.7,
    equipment: row.equipment,
    availability: row.availability_status,
    location: demoAmbulances[index % demoAmbulances.length].location
  }));
}

export async function createAppointment(payload: {
  patientId?: string;
  doctorId: string;
  scheduledFor: string;
  visitType: "clinic" | "home" | "video";
  reason: string;
  fee: number;
}) {
  if (!isSupabaseConfigured || !supabase || !payload.patientId) {
    return {
      id: crypto.randomUUID(),
      status: "confirmed" as const
    };
  }

  const { data, error } = await supabase
    .from("appointments")
    .insert({
      patient_id: payload.patientId,
      doctor_id: payload.doctorId,
      scheduled_for: payload.scheduledFor,
      visit_type: payload.visitType,
      reason: payload.reason,
      fee: payload.fee,
      status: "pending"
    })
    .select("id, status")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function createAmbulanceRequest(payload: {
  patientId?: string;
  ambulance?: AmbulanceUnit;
  pickupAddress: string;
  destinationAddress?: string;
  position: { lat: number; lng: number };
  scheduledFor?: string;
  patientCondition?: string;
}) {
  if (!isSupabaseConfigured || !supabase || !payload.patientId) {
    return {
      id: crypto.randomUUID(),
      status: "accepted" as const
    };
  }

  const { data, error } = await supabase
    .from("ambulance_requests")
    .insert({
      patient_id: payload.patientId,
      provider_id: payload.ambulance?.providerId,
      ambulance_id: payload.ambulance?.id,
      pickup_address: payload.pickupAddress,
      destination_address: payload.destinationAddress,
      pickup_location: `POINT(${payload.position.lng} ${payload.position.lat})`,
      scheduled_for: payload.scheduledFor,
      patient_condition: payload.patientCondition,
      estimated_arrival_minutes: payload.ambulance?.etaMinutes,
      fare_estimate: payload.ambulance ? 65 + payload.ambulance.distanceKm * 18 : 95,
      status: "pending",
      priority: "critical"
    })
    .select("id, status")
    .single();

  if (error) {
    throw error;
  }

  return data;
}
