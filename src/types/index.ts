export type UserRole = "patient" | "doctor" | "ambulance_provider" | "admin";

export type VerificationStatus = "pending" | "verified" | "rejected" | "suspended";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "rejected"
  | "cancelled"
  | "completed"
  | "no_show";

export type AmbulanceRequestStatus =
  | "draft"
  | "pending"
  | "accepted"
  | "driver_en_route"
  | "arrived"
  | "in_transit"
  | "completed"
  | "cancelled";

export type EmergencyPriority = "low" | "medium" | "high" | "critical";

export interface Profile {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  preferredLanguage: string;
  darkMode: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  avatarUrl: string;
  specialties: string[];
  hospital: string;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  nextAvailable: string;
  distanceKm: number;
  languages: string[];
  telemedicine: boolean;
  verified: boolean;
  bio: string;
  qualifications: string[];
}

export interface AmbulanceUnit {
  id: string;
  providerId: string;
  providerName: string;
  vehicleNumber: string;
  vehicleType: string;
  etaMinutes: number;
  distanceKm: number;
  rating: number;
  equipment: string[];
  availability: "available" | "busy" | "offline" | "maintenance";
  location: {
    lat: number;
    lng: number;
  };
}

export interface Appointment {
  id: string;
  doctorName: string;
  doctorAvatar: string;
  specialty: string;
  scheduledFor: string;
  status: AppointmentStatus;
  visitType: "clinic" | "home" | "video";
  fee: number;
  meetingUrl?: string;
}

export interface AmbulanceRequest {
  id: string;
  status: AmbulanceRequestStatus;
  priority: EmergencyPriority;
  providerName: string;
  vehicleNumber: string;
  etaMinutes: number;
  pickupAddress: string;
  destinationAddress?: string;
  requestedAt: string;
  fareEstimate: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  type: "booking" | "ambulance" | "payment" | "system" | "emergency";
}

export interface MedicalRecord {
  id: string;
  title: string;
  type: string;
  date: string;
  summary: string;
  clinician: string;
}

export interface PaymentSummary {
  id: string;
  label: string;
  amount: number;
  status: "pending" | "authorized" | "paid" | "failed" | "refunded" | "disputed";
  createdAt: string;
}

export interface DashboardMetric {
  label: string;
  value: string;
  trend: string;
  tone: "teal" | "blue" | "rose" | "amber" | "slate";
}

export interface ActivityEvent {
  id: string;
  title: string;
  description: string;
  time: string;
  status: "success" | "warning" | "info" | "danger";
}
