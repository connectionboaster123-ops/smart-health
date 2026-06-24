import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { UserRole } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function roleLabel(role: UserRole) {
  const labels: Record<UserRole, string> = {
    patient: "Patient",
    doctor: "Doctor",
    ambulance_provider: "Ambulance Provider",
    admin: "Administrator"
  };

  return labels[role];
}

export function roleHomePath(role: UserRole) {
  const paths: Record<UserRole, string> = {
    patient: "/patient",
    doctor: "/doctor",
    ambulance_provider: "/provider",
    admin: "/admin"
  };

  return paths[role];
}

export function statusTone(status: string): "success" | "warning" | "danger" | "info" {
  if (["confirmed", "paid", "verified", "completed", "available", "success"].includes(status)) {
    return "success";
  }

  if (["pending", "authorized", "driver_en_route", "accepted", "warning"].includes(status)) {
    return "warning";
  }

  if (["critical", "failed", "rejected", "cancelled", "danger"].includes(status)) {
    return "danger";
  }

  return "info";
}
