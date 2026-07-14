-- Trav v1 schema. RLS scoped to auth.uid() on every user table (eng review).
-- Apply with the Supabase CLI or SQL editor.

create type chip_status as enum ('resolving', 'resolved', 'needs_review');
create type platform    as enum ('google_maps','instagram','tiktok','trav','manual');
create type transport    as enum ('drive','walk','transit');

-- Phone <-> account pairing (email-first onboarding, then WhatsApp bind). T13.
create table wa_links (
  phone      text primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Webhook idempotency (T1): one row per Meta message id.
create table wa_messages (
  message_id text primary key,
  from_phone text not null,
  created_at timestamptz not null default now()
);

-- A saved place. Lands in Unfiled until filed into folder(s).
create table chips (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  source_url text,
  platform   platform not null default 'manual',
  status     chip_status not null default 'resolving',
  name       text,
  address    text,
  city       text,
  category   text,
  place_id   text,
  lat        double precision,
  lng        double precision,
  hours      jsonb,
  photo_url  text,
  rating     real,
  created_at timestamptz not null default now()
);
create index chips_user_idx on chips(user_id);

create table folders (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  cover_url  text,
  created_at timestamptz not null default now()
);

-- Many-to-many: a chip can be in multiple folders (T15). Unfiled = 0 rows here.
create table chip_folders (
  chip_id   uuid references chips(id) on delete cascade,
  folder_id uuid references folders(id) on delete cascade,
  primary key (chip_id, folder_id)
);

create table trips (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  folder_id  uuid references folders(id) on delete set null,
  title      text not null,
  start_date date,
  end_date   date,
  transport  transport not null default 'drive',
  created_at timestamptz not null default now()
);

create table trip_stops (
  id         uuid primary key default gen_random_uuid(),
  trip_id    uuid not null references trips(id) on delete cascade,
  chip_id    uuid not null references chips(id) on delete cascade,
  day        int not null default 1,
  "order"    int not null default 0,
  start_time text,
  end_time   text
);
create index trip_stops_trip_idx on trip_stops(trip_id);

-- The moat, captured passively from day one (T8, CEO decision). No personalization yet.
create table taste_signals (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  kind       text not null,       -- 'saved' | 'kept' | 'removed'
  category   text,
  chip_id    uuid references chips(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Tokenized view-only public share (T9).
create table shares (
  token      text primary key,
  trip_id    uuid not null references trips(id) on delete cascade,
  revoked    boolean not null default false,
  created_at timestamptz not null default now()
);

-- Row Level Security --------------------------------------------------------
alter table chips         enable row level security;
alter table folders       enable row level security;
alter table chip_folders  enable row level security;
alter table trips         enable row level security;
alter table trip_stops    enable row level security;
alter table taste_signals enable row level security;
alter table wa_links      enable row level security;

create policy "own chips"   on chips         using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own folders" on folders       using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own trips"   on trips         using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own signals" on taste_signals using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own links"   on wa_links      using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own chip_folders" on chip_folders using (
  exists (select 1 from chips c where c.id = chip_id and c.user_id = auth.uid())
);
create policy "own trip_stops" on trip_stops using (
  exists (select 1 from trips t where t.id = trip_id and t.user_id = auth.uid())
);
-- wa_messages, shares: written by the service role only (no anon policy).
alter table wa_messages enable row level security;
alter table shares      enable row level security;
