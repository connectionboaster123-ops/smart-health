# MediRescue

MediRescue is a modern full-stack healthcare platform for emergency ambulance requests, doctor booking, patient care dashboards, and healthcare operations.

## Stack

- React, TypeScript, Vite
- Tailwind CSS
- Supabase Auth, PostgreSQL, Realtime, Storage-ready schema
- OpenStreetMap embed for zero-key map previews, with a Google Maps key slot available

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and add your Supabase values.

3. Apply the Supabase schema from `supabase/migrations/202606230001_medirescue_schema.sql`.

4. Run the app:

   ```bash
   npm run dev
   ```

The UI also runs in demo mode without Supabase credentials, so the product flows can be reviewed before backend setup.

## Main Routes

- `/` - public homepage
- `/auth` - login and registration
- `/patient` - patient dashboard
- `/doctors` - doctor discovery
- `/book-doctor` - appointment booking
- `/ambulance` - ambulance request and live tracking
- `/doctor` - doctor dashboard
- `/provider` - ambulance provider dashboard
- `/admin` - administrator dashboard
- `/settings` - profile, language, and notification settings

## Supabase Notes

The migration includes:

- Core healthcare tables requested by the product brief
- Extended tables for availability, tracking, prescriptions, medical records, chat, audit logs, and activity tracking
- Row Level Security policies for patient, doctor, ambulance provider, and admin roles
- Auth user profile creation trigger
- `nearby_ambulances` RPC for location-based ambulance search

## Production Integrations To Add

- Payment provider server edge function for card/mobile money capture
- Email provider templates for booking and emergency workflows
- Push notifications through FCM/APNS or a web-push service
- Background location updates from the driver mobile app
- Video consultation provider credentials
