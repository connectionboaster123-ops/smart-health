# MediRescue Architecture

## Frontend

The app is organized around role-first routes:

- Public discovery and conversion pages
- Patient emergency, booking, history, and medical record workflows
- Doctor schedule, appointment, earnings, and telemedicine tools
- Ambulance provider dispatch, tracking, vehicle, and earnings tools
- Admin verification, payment, emergency, analytics, and audit surfaces

`src/lib/data.ts` exposes Supabase-aware service functions with demo fallbacks. This lets the product be reviewed before credentials exist while preserving the same integration points used in production.

## Backend

Supabase provides:

- Auth identity
- PostgreSQL tables and constraints
- RLS authorization
- Realtime-ready tables for ambulance requests, notifications, chat, and tracking
- SQL RPC helpers for nearby ambulance search

The recommended deployment path is to apply the migration, create storage buckets for verification files and medical documents, and add Edge Functions for payment authorization, email delivery, and webhook reconciliation.

## Security Model

- `profiles.role` drives role-specific access.
- Patients can manage their own records and requests.
- Doctors can read patient information only when appointment relationships exist.
- Ambulance providers can view and update assigned dispatch work.
- Admins can manage verification, payments, emergency requests, reports, and system data.
- Audit and activity tables capture sensitive operational events.

## Realtime Channels

Use Supabase Realtime subscriptions on:

- `ambulance_requests`
- `ambulance_locations`
- `appointments`
- `notifications`
- `chat_messages`
- `emergency_requests`

The current UI includes simulated tracking states that can be replaced by these subscriptions directly.
