-- GramSeva initial schema

create type user_role as enum ('farmer', 'worker', 'machinery_owner', 'coordinator');
create type service_type as enum ('chhatni','fawrani','nagrani','todani','perni','kapni','bandhani','tractor','drone','pump');
create type booking_type as enum ('labour','machinery');
create type booking_status as enum ('pending','searching','confirmed','in_progress','completed','cancelled');
create type machinery_type as enum ('tractor','sprayer','drone','pump','duster','rotavator');
create type application_status as enum ('applied','accepted','rejected');

-- 1. users
create table public.users (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid references auth.users(id),
  phone text unique not null,
  name text not null,
  name_mr text,
  role user_role not null,
  village text not null,
  taluka text,
  district text default 'Sangli',
  profile_photo_url text,
  push_token text,
  is_verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. workers
create table public.workers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  skills text[] default '{}',
  daily_rate integer default 0,
  is_available boolean default true,
  experience_years integer default 0,
  rating decimal(3,2) default 0,
  total_jobs integer default 0,
  gang_size integer default 1,
  upi_id text
);

-- 3. machinery
create table public.machinery (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.users(id) on delete cascade not null,
  type machinery_type not null,
  rate_per_hour integer default 0,
  rate_per_acre integer default 0,
  is_available boolean default true,
  description_mr text,
  village text,
  photo_urls text[] default '{}'
);

-- booking number sequence
create sequence booking_number_seq start 1001;

-- 4. bookings
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_number text unique not null default ('GS-' || nextval('booking_number_seq')),
  farmer_id uuid references public.users(id) not null,
  service_type service_type not null,
  booking_type booking_type not null default 'labour',
  status booking_status not null default 'pending',
  date date not null,
  time_slot text,
  acres decimal(6,2),
  workers_needed integer default 1,
  village text not null,
  field_survey_number text,
  special_instructions text,
  estimated_cost_min integer,
  estimated_cost_max integer,
  actual_cost integer,
  worker_id uuid references public.workers(id),
  machinery_id uuid references public.machinery(id),
  coordinator_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. job_applications
create table public.job_applications (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete cascade not null,
  worker_id uuid references public.workers(id) on delete cascade not null,
  status application_status default 'applied',
  created_at timestamptz default now(),
  unique (booking_id, worker_id)
);

-- 6. ratings
create table public.ratings (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) not null,
  rated_by uuid references public.users(id) not null,
  rated_user_id uuid references public.users(id) not null,
  score integer not null check (score between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

-- 7. notifications
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  title_mr text not null,
  body_mr text,
  type text,
  is_read boolean default false,
  booking_id uuid references public.bookings(id),
  created_at timestamptz default now()
);

-- Indexes
create index idx_users_village on public.users(village);
create index idx_users_phone on public.users(phone);
create index idx_workers_user_id on public.workers(user_id);
create index idx_workers_available on public.workers(is_available);
create index idx_bookings_farmer on public.bookings(farmer_id);
create index idx_bookings_status on public.bookings(status);
create index idx_bookings_date on public.bookings(date);
create index idx_bookings_village on public.bookings(village);
create index idx_notifications_user on public.notifications(user_id);

-- updated_at trigger
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_updated_at before update on public.users
  for each row execute function set_updated_at();
create trigger bookings_updated_at before update on public.bookings
  for each row execute function set_updated_at();

-- Worker rating recalculation
create or replace function recalc_worker_rating() returns trigger as $$
begin
  update public.workers w
  set rating = (
    select coalesce(avg(r.score), 0)
    from public.ratings r
    where r.rated_user_id = w.user_id
  )
  where w.user_id = new.rated_user_id;
  return new;
end;
$$ language plpgsql;

create trigger ratings_recalc after insert on public.ratings
  for each row execute function recalc_worker_rating();

-- View: available workers with user info
create view public.available_workers_near_village as
select w.*, u.name, u.name_mr, u.village, u.taluka, u.phone, u.profile_photo_url
from public.workers w
join public.users u on u.id = w.user_id
where w.is_available = true;

-- RLS
alter table public.users enable row level security;
alter table public.workers enable row level security;
alter table public.machinery enable row level security;
alter table public.bookings enable row level security;
alter table public.job_applications enable row level security;
alter table public.ratings enable row level security;
alter table public.notifications enable row level security;

-- users: read all (needed for matching), write own
create policy "users_select" on public.users for select using (true);
create policy "users_insert" on public.users for insert with check (auth.uid() = auth_id);
create policy "users_update" on public.users for update using (auth.uid() = auth_id);

-- workers: read all, write own
create policy "workers_select" on public.workers for select using (true);
create policy "workers_write" on public.workers for all using (
  user_id in (select id from public.users where auth_id = auth.uid())
);

-- machinery: read all, write own
create policy "machinery_select" on public.machinery for select using (true);
create policy "machinery_write" on public.machinery for all using (
  owner_id in (select id from public.users where auth_id = auth.uid())
);

-- bookings: farmer sees own; assigned worker sees theirs; pending visible to workers; coordinators see all
create policy "bookings_select" on public.bookings for select using (
  farmer_id in (select id from public.users where auth_id = auth.uid())
  or worker_id in (select w.id from public.workers w join public.users u on u.id = w.user_id where u.auth_id = auth.uid())
  or status in ('pending','searching')
  or exists (select 1 from public.users where auth_id = auth.uid() and role = 'coordinator')
);
create policy "bookings_insert" on public.bookings for insert with check (
  farmer_id in (select id from public.users where auth_id = auth.uid())
  or exists (select 1 from public.users where auth_id = auth.uid() and role = 'coordinator')
);
create policy "bookings_update" on public.bookings for update using (
  farmer_id in (select id from public.users where auth_id = auth.uid())
  or worker_id in (select w.id from public.workers w join public.users u on u.id = w.user_id where u.auth_id = auth.uid())
  or exists (select 1 from public.users where auth_id = auth.uid() and role = 'coordinator')
);

-- job_applications: worker writes own, booking farmer reads
create policy "applications_select" on public.job_applications for select using (true);
create policy "applications_write" on public.job_applications for all using (
  worker_id in (select w.id from public.workers w join public.users u on u.id = w.user_id where u.auth_id = auth.uid())
);

-- ratings: read all, insert by rater
create policy "ratings_select" on public.ratings for select using (true);
create policy "ratings_insert" on public.ratings for insert with check (
  rated_by in (select id from public.users where auth_id = auth.uid())
);

-- notifications: own only
create policy "notifications_own" on public.notifications for all using (
  user_id in (select id from public.users where auth_id = auth.uid())
);
