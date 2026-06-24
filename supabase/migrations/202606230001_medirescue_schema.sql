-- MediRescue Supabase schema
-- Apply in the Supabase SQL editor or with the Supabase CLI.

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "postgis";

create type public.user_role as enum ('patient', 'doctor', 'ambulance_provider', 'admin');
create type public.verification_status as enum ('pending', 'verified', 'rejected', 'suspended');
create type public.appointment_status as enum ('pending', 'confirmed', 'rejected', 'cancelled', 'completed', 'no_show');
create type public.ambulance_request_status as enum ('draft', 'pending', 'accepted', 'driver_en_route', 'arrived', 'in_transit', 'completed', 'cancelled');
create type public.payment_status as enum ('pending', 'authorized', 'paid', 'failed', 'refunded', 'disputed');
create type public.ambulance_availability as enum ('offline', 'available', 'busy', 'maintenance');
create type public.emergency_priority as enum ('low', 'medium', 'high', 'critical');
create type public.notification_channel as enum ('in_app', 'email', 'sms', 'push');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'patient',
  full_name text not null default '',
  email text unique,
  phone text,
  avatar_url text,
  locale text not null default 'en',
  preferred_language text not null default 'en',
  dark_mode boolean not null default false,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create table public.patients (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  blood_group text check (blood_group in ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  emergency_contacts jsonb not null default '[]'::jsonb,
  allergies text[] not null default '{}',
  chronic_conditions text[] not null default '{}',
  medical_notes text,
  home_address text,
  location geography(point, 4326),
  insurance_provider text,
  insurance_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger patients_set_updated_at
before update on public.patients
for each row execute function public.set_updated_at();

create table public.doctors (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  license_number text unique not null,
  specialties text[] not null default '{}',
  qualifications text[] not null default '{}',
  biography text,
  hospital_affiliation text,
  consultation_fee numeric(12,2) not null default 0 check (consultation_fee >= 0),
  telemedicine_enabled boolean not null default true,
  verification_status public.verification_status not null default 'pending',
  verification_notes text,
  rating numeric(2,1) not null default 0 check (rating >= 0 and rating <= 5),
  review_count integer not null default 0 check (review_count >= 0),
  total_earnings numeric(14,2) not null default 0 check (total_earnings >= 0),
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger doctors_set_updated_at
before update on public.doctors
for each row execute function public.set_updated_at();

create table public.doctor_availability (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctors(profile_id) on delete cascade,
  day_of_week integer not null check (day_of_week between 0 and 6),
  starts_at time not null,
  ends_at time not null,
  slot_minutes integer not null default 30 check (slot_minutes in (15, 20, 30, 45, 60)),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint doctor_availability_valid_time check (ends_at > starts_at)
);

create trigger doctor_availability_set_updated_at
before update on public.doctor_availability
for each row execute function public.set_updated_at();

create table public.ambulance_providers (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  provider_name text not null,
  license_number text unique not null,
  service_area text,
  verification_status public.verification_status not null default 'pending',
  availability_status public.ambulance_availability not null default 'offline',
  rating numeric(2,1) not null default 0 check (rating >= 0 and rating <= 5),
  review_count integer not null default 0 check (review_count >= 0),
  total_earnings numeric(14,2) not null default 0 check (total_earnings >= 0),
  verification_notes text,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger ambulance_providers_set_updated_at
before update on public.ambulance_providers
for each row execute function public.set_updated_at();

create table public.ambulances (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.ambulance_providers(profile_id) on delete cascade,
  vehicle_number text unique not null,
  vehicle_type text not null default 'Advanced Life Support',
  capacity integer not null default 2 check (capacity > 0),
  equipment text[] not null default '{}',
  photos text[] not null default '{}',
  base_address text,
  base_location geography(point, 4326),
  current_location geography(point, 4326),
  availability_status public.ambulance_availability not null default 'offline',
  last_location_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger ambulances_set_updated_at
before update on public.ambulances
for each row execute function public.set_updated_at();

create table public.ambulance_locations (
  id uuid primary key default gen_random_uuid(),
  ambulance_id uuid not null references public.ambulances(id) on delete cascade,
  provider_id uuid not null references public.ambulance_providers(profile_id) on delete cascade,
  location geography(point, 4326) not null,
  speed_kph numeric(6,2),
  heading_degrees numeric(5,2),
  recorded_at timestamptz not null default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(profile_id) on delete cascade,
  doctor_id uuid not null references public.doctors(profile_id) on delete cascade,
  scheduled_for timestamptz not null,
  duration_minutes integer not null default 30 check (duration_minutes > 0),
  status public.appointment_status not null default 'pending',
  visit_type text not null default 'clinic' check (visit_type in ('clinic', 'home', 'video')),
  reason text,
  patient_notes text,
  doctor_notes text,
  fee numeric(12,2) not null default 0 check (fee >= 0),
  meeting_url text,
  cancelled_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger appointments_set_updated_at
before update on public.appointments
for each row execute function public.set_updated_at();

create table public.ambulance_requests (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(profile_id) on delete cascade,
  provider_id uuid references public.ambulance_providers(profile_id) on delete set null,
  ambulance_id uuid references public.ambulances(id) on delete set null,
  status public.ambulance_request_status not null default 'pending',
  priority public.emergency_priority not null default 'high',
  pickup_address text not null,
  pickup_location geography(point, 4326) not null,
  destination_address text,
  destination_location geography(point, 4326),
  scheduled_for timestamptz,
  requested_at timestamptz not null default now(),
  accepted_at timestamptz,
  arrived_at timestamptz,
  completed_at timestamptz,
  estimated_arrival_minutes integer,
  patient_condition text,
  notes text,
  fare_estimate numeric(12,2) not null default 0 check (fare_estimate >= 0),
  final_fare numeric(12,2) check (final_fare >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger ambulance_requests_set_updated_at
before update on public.ambulance_requests
for each row execute function public.set_updated_at();

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(profile_id) on delete cascade,
  appointment_id uuid references public.appointments(id) on delete set null,
  ambulance_request_id uuid references public.ambulance_requests(id) on delete set null,
  amount numeric(12,2) not null check (amount >= 0),
  currency text not null default 'USD',
  status public.payment_status not null default 'pending',
  provider text,
  provider_reference text unique,
  payment_method text,
  paid_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint payments_single_context check (
    (appointment_id is not null)::integer + (ambulance_request_id is not null)::integer = 1
  )
);

create trigger payments_set_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(profile_id) on delete cascade,
  doctor_id uuid references public.doctors(profile_id) on delete cascade,
  provider_id uuid references public.ambulance_providers(profile_id) on delete cascade,
  appointment_id uuid references public.appointments(id) on delete set null,
  ambulance_request_id uuid references public.ambulance_requests(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reviews_single_target check (
    (doctor_id is not null)::integer + (provider_id is not null)::integer = 1
  )
);

create trigger reviews_set_updated_at
before update on public.reviews
for each row execute function public.set_updated_at();

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  channel public.notification_channel not null default 'in_app',
  title text not null,
  body text not null,
  read_at timestamptz,
  action_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.emergency_requests (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patients(profile_id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  priority public.emergency_priority not null default 'critical',
  status public.ambulance_request_status not null default 'pending',
  emergency_type text not null default 'Medical emergency',
  contact_phone text,
  location geography(point, 4326),
  address text,
  triage_notes text,
  ambulance_request_id uuid references public.ambulance_requests(id) on delete set null,
  assigned_admin_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger emergency_requests_set_updated_at
before update on public.emergency_requests
for each row execute function public.set_updated_at();

create table public.medical_records (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(profile_id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  appointment_id uuid references public.appointments(id) on delete set null,
  title text not null,
  record_type text not null default 'clinical_note',
  summary text,
  document_url text,
  is_sensitive boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger medical_records_set_updated_at
before update on public.medical_records
for each row execute function public.set_updated_at();

create table public.prescriptions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(profile_id) on delete cascade,
  doctor_id uuid not null references public.doctors(profile_id) on delete cascade,
  appointment_id uuid references public.appointments(id) on delete set null,
  medication_name text not null,
  dosage text not null,
  frequency text not null,
  duration text not null,
  instructions text,
  status text not null default 'active' check (status in ('active', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger prescriptions_set_updated_at
before update on public.prescriptions
for each row execute function public.set_updated_at();

create table public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(profile_id) on delete cascade,
  doctor_id uuid references public.doctors(profile_id) on delete cascade,
  provider_id uuid references public.ambulance_providers(profile_id) on delete cascade,
  appointment_id uuid references public.appointments(id) on delete set null,
  ambulance_request_id uuid references public.ambulance_requests(id) on delete set null,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  constraint chat_threads_single_care_team check (
    (doctor_id is not null)::integer + (provider_id is not null)::integer = 1
  )
);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  attachments text[] not null default '{}',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  table_name text,
  record_id uuid,
  ip_address inet,
  user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.activity_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  event_type text not null,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index patients_location_idx on public.patients using gist(location);
create index doctors_specialties_idx on public.doctors using gin(specialties);
create index doctors_verification_idx on public.doctors(verification_status);
create index ambulances_current_location_idx on public.ambulances using gist(current_location);
create index ambulances_availability_idx on public.ambulances(availability_status);
create index ambulance_locations_ambulance_recorded_idx on public.ambulance_locations(ambulance_id, recorded_at desc);
create index appointments_patient_idx on public.appointments(patient_id, scheduled_for desc);
create index appointments_doctor_idx on public.appointments(doctor_id, scheduled_for desc);
create index ambulance_requests_patient_idx on public.ambulance_requests(patient_id, requested_at desc);
create index ambulance_requests_provider_idx on public.ambulance_requests(provider_id, requested_at desc);
create index payments_patient_idx on public.payments(patient_id, created_at desc);
create index notifications_recipient_idx on public.notifications(recipient_id, created_at desc);
create index emergency_requests_status_idx on public.emergency_requests(status, created_at desc);
create index chat_messages_thread_idx on public.chat_messages(thread_id, created_at desc);
create index audit_logs_created_idx on public.audit_logs(created_at desc);
create index activity_events_profile_idx on public.activity_events(profile_id, created_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'phone',
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'patient')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.is_verified_doctor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.doctors
    where profile_id = auth.uid() and verification_status = 'verified'
  );
$$;

create or replace function public.is_verified_provider()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.ambulance_providers
    where profile_id = auth.uid() and verification_status = 'verified'
  );
$$;

create or replace function public.nearby_ambulances(
  latitude double precision,
  longitude double precision,
  radius_meters integer default 15000,
  result_limit integer default 10
)
returns table (
  ambulance_id uuid,
  provider_id uuid,
  provider_name text,
  vehicle_number text,
  vehicle_type text,
  equipment text[],
  distance_meters double precision,
  availability_status public.ambulance_availability
)
language sql
stable
security definer
set search_path = public
as $$
  select
    a.id,
    a.provider_id,
    ap.provider_name,
    a.vehicle_number,
    a.vehicle_type,
    a.equipment,
    st_distance(a.current_location, st_setsrid(st_makepoint(longitude, latitude), 4326)::geography) as distance_meters,
    a.availability_status
  from public.ambulances a
  join public.ambulance_providers ap on ap.profile_id = a.provider_id
  where
    a.availability_status = 'available'
    and ap.verification_status = 'verified'
    and a.current_location is not null
    and st_dwithin(a.current_location, st_setsrid(st_makepoint(longitude, latitude), 4326)::geography, radius_meters)
  order by distance_meters
  limit result_limit;
$$;

alter table public.profiles enable row level security;
alter table public.patients enable row level security;
alter table public.doctors enable row level security;
alter table public.doctor_availability enable row level security;
alter table public.ambulance_providers enable row level security;
alter table public.ambulances enable row level security;
alter table public.ambulance_locations enable row level security;
alter table public.appointments enable row level security;
alter table public.ambulance_requests enable row level security;
alter table public.payments enable row level security;
alter table public.reviews enable row level security;
alter table public.notifications enable row level security;
alter table public.emergency_requests enable row level security;
alter table public.medical_records enable row level security;
alter table public.prescriptions enable row level security;
alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;
alter table public.audit_logs enable row level security;
alter table public.activity_events enable row level security;

create policy "Profiles are visible to owner, care teams, and admins"
on public.profiles for select
using (
  id = auth.uid()
  or public.is_admin()
  or id in (select doctor_id from public.appointments where patient_id = auth.uid())
  or id in (select patient_id from public.appointments where doctor_id = auth.uid())
  or id in (select provider_id from public.ambulance_requests where patient_id = auth.uid())
  or id in (select patient_id from public.ambulance_requests where provider_id = auth.uid())
);

create policy "Users insert their own profile"
on public.profiles for insert
with check (id = auth.uid());

create policy "Users update their own profile"
on public.profiles for update
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

create policy "Patients are visible to owners, assigned teams, and admins"
on public.patients for select
using (
  profile_id = auth.uid()
  or public.is_admin()
  or exists (select 1 from public.appointments a where a.patient_id = profile_id and a.doctor_id = auth.uid())
  or exists (select 1 from public.ambulance_requests ar where ar.patient_id = profile_id and ar.provider_id = auth.uid())
);

create policy "Patients manage their own patient profile"
on public.patients for all
using (profile_id = auth.uid() or public.is_admin())
with check (profile_id = auth.uid() or public.is_admin());

create policy "Verified doctors are public"
on public.doctors for select
using (verification_status = 'verified' or profile_id = auth.uid() or public.is_admin());

create policy "Doctors manage their own profile"
on public.doctors for all
using (profile_id = auth.uid() or public.is_admin())
with check (profile_id = auth.uid() or public.is_admin());

create policy "Doctor availability public for verified doctors"
on public.doctor_availability for select
using (
  is_active
  and exists (
    select 1 from public.doctors d
    where d.profile_id = doctor_id and d.verification_status = 'verified'
  )
  or doctor_id = auth.uid()
  or public.is_admin()
);

create policy "Doctors manage own availability"
on public.doctor_availability for all
using (doctor_id = auth.uid() or public.is_admin())
with check (doctor_id = auth.uid() or public.is_admin());

create policy "Verified ambulance providers are visible"
on public.ambulance_providers for select
using (verification_status = 'verified' or profile_id = auth.uid() or public.is_admin());

create policy "Providers manage own provider profile"
on public.ambulance_providers for all
using (profile_id = auth.uid() or public.is_admin())
with check (profile_id = auth.uid() or public.is_admin());

create policy "Available ambulances are visible"
on public.ambulances for select
using (
  availability_status = 'available'
  or provider_id = auth.uid()
  or public.is_admin()
);

create policy "Providers manage own ambulances"
on public.ambulances for all
using (provider_id = auth.uid() or public.is_admin())
with check (provider_id = auth.uid() or public.is_admin());

create policy "Ambulance locations visible to assigned patient, provider, and admin"
on public.ambulance_locations for select
using (
  provider_id = auth.uid()
  or public.is_admin()
  or exists (
    select 1 from public.ambulance_requests ar
    where ar.ambulance_id = ambulance_locations.ambulance_id
      and ar.patient_id = auth.uid()
      and ar.status in ('accepted', 'driver_en_route', 'arrived', 'in_transit')
  )
);

create policy "Providers insert own ambulance locations"
on public.ambulance_locations for insert
with check (provider_id = auth.uid() or public.is_admin());

create policy "Appointments visible to patient, doctor, and admin"
on public.appointments for select
using (patient_id = auth.uid() or doctor_id = auth.uid() or public.is_admin());

create policy "Patients create appointments"
on public.appointments for insert
with check (patient_id = auth.uid() or public.is_admin());

create policy "Patients and doctors update appointment workflow"
on public.appointments for update
using (patient_id = auth.uid() or doctor_id = auth.uid() or public.is_admin())
with check (patient_id = auth.uid() or doctor_id = auth.uid() or public.is_admin());

create policy "Ambulance requests visible to patient, provider, and admin"
on public.ambulance_requests for select
using (patient_id = auth.uid() or provider_id = auth.uid() or public.is_admin());

create policy "Patients create ambulance requests"
on public.ambulance_requests for insert
with check (patient_id = auth.uid() or public.is_admin());

create policy "Patients and providers update ambulance requests"
on public.ambulance_requests for update
using (patient_id = auth.uid() or provider_id = auth.uid() or public.is_admin())
with check (patient_id = auth.uid() or provider_id = auth.uid() or public.is_admin());

create policy "Payments visible to owner, service provider, and admin"
on public.payments for select
using (
  patient_id = auth.uid()
  or public.is_admin()
  or exists (select 1 from public.appointments a where a.id = appointment_id and a.doctor_id = auth.uid())
  or exists (select 1 from public.ambulance_requests ar where ar.id = ambulance_request_id and ar.provider_id = auth.uid())
);

create policy "Patients create their own payments"
on public.payments for insert
with check (patient_id = auth.uid() or public.is_admin());

create policy "Admins and service processes update payments"
on public.payments for update
using (public.is_admin())
with check (public.is_admin());

create policy "Reviews are visible to authenticated users"
on public.reviews for select
to authenticated
using (true);

create policy "Patients create reviews for completed care"
on public.reviews for insert
with check (
  patient_id = auth.uid()
  and (
    exists (select 1 from public.appointments a where a.id = appointment_id and a.patient_id = auth.uid() and a.status = 'completed')
    or exists (select 1 from public.ambulance_requests ar where ar.id = ambulance_request_id and ar.patient_id = auth.uid() and ar.status = 'completed')
  )
);

create policy "Review owners and admins update reviews"
on public.reviews for update
using (patient_id = auth.uid() or public.is_admin())
with check (patient_id = auth.uid() or public.is_admin());

create policy "Users read own notifications"
on public.notifications for select
using (recipient_id = auth.uid() or public.is_admin());

create policy "Users update own notifications"
on public.notifications for update
using (recipient_id = auth.uid() or public.is_admin())
with check (recipient_id = auth.uid() or public.is_admin());

create policy "Admins create notifications"
on public.notifications for insert
with check (public.is_admin() or recipient_id = auth.uid());

create policy "Emergency requests visible to patient, providers, and admins"
on public.emergency_requests for select
using (
  patient_id = auth.uid()
  or created_by = auth.uid()
  or public.is_admin()
  or public.is_verified_provider()
);

create policy "Authenticated users create emergency requests"
on public.emergency_requests for insert
to authenticated
with check (created_by = auth.uid() or patient_id = auth.uid() or public.is_admin());

create policy "Admins and providers update emergency requests"
on public.emergency_requests for update
using (public.is_admin() or public.is_verified_provider())
with check (public.is_admin() or public.is_verified_provider());

create policy "Medical records visible to patient, authoring doctor, and admin"
on public.medical_records for select
using (
  patient_id = auth.uid()
  or created_by = auth.uid()
  or public.is_admin()
  or exists (select 1 from public.appointments a where a.id = appointment_id and a.doctor_id = auth.uid())
);

create policy "Patients and verified doctors create medical records"
on public.medical_records for insert
with check (
  patient_id = auth.uid()
  or public.is_admin()
  or (created_by = auth.uid() and public.is_verified_doctor())
);

create policy "Medical record owners and admins update records"
on public.medical_records for update
using (patient_id = auth.uid() or created_by = auth.uid() or public.is_admin())
with check (patient_id = auth.uid() or created_by = auth.uid() or public.is_admin());

create policy "Prescriptions visible to patient, doctor, and admin"
on public.prescriptions for select
using (patient_id = auth.uid() or doctor_id = auth.uid() or public.is_admin());

create policy "Verified doctors create prescriptions"
on public.prescriptions for insert
with check (doctor_id = auth.uid() and public.is_verified_doctor() or public.is_admin());

create policy "Doctors manage their prescriptions"
on public.prescriptions for update
using (doctor_id = auth.uid() or public.is_admin())
with check (doctor_id = auth.uid() or public.is_admin());

create policy "Chat threads visible to participants"
on public.chat_threads for select
using (patient_id = auth.uid() or doctor_id = auth.uid() or provider_id = auth.uid() or public.is_admin());

create policy "Participants create chat threads"
on public.chat_threads for insert
with check (patient_id = auth.uid() or doctor_id = auth.uid() or provider_id = auth.uid() or public.is_admin());

create policy "Chat messages visible to thread participants"
on public.chat_messages for select
using (
  public.is_admin()
  or exists (
    select 1 from public.chat_threads t
    where t.id = thread_id
      and (t.patient_id = auth.uid() or t.doctor_id = auth.uid() or t.provider_id = auth.uid())
  )
);

create policy "Thread participants send messages"
on public.chat_messages for insert
with check (
  sender_id = auth.uid()
  and exists (
    select 1 from public.chat_threads t
    where t.id = thread_id
      and (t.patient_id = auth.uid() or t.doctor_id = auth.uid() or t.provider_id = auth.uid())
  )
);

create policy "Audit logs are admin visible"
on public.audit_logs for select
using (public.is_admin());

create policy "Authenticated users can append audit logs"
on public.audit_logs for insert
to authenticated
with check (actor_id = auth.uid() or public.is_admin());

create policy "Activity visible to owner and admin"
on public.activity_events for select
using (profile_id = auth.uid() or public.is_admin());

create policy "Activity append for owner and admin"
on public.activity_events for insert
with check (profile_id = auth.uid() or public.is_admin());

grant usage on schema public to anon, authenticated;
grant execute on function public.nearby_ambulances(double precision, double precision, integer, integer) to authenticated;
