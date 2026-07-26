-- Pulsestate — Supabase Schema (v2)
-- Diesen kompletten Inhalt im Supabase Dashboard unter "SQL Editor" -> "New query" einfügen
-- und ausführen. Sicher erneut auszuführen, auch wenn du schon die v1-Version laufen hattest —
-- alle Befehle sind so geschrieben, dass sie nichts doppelt anlegen oder überschreiben.

-- ============================================================
-- 1. PROFILES: Basis-Tabelle für alle Accounts (User + Unternehmer + Staff)
-- ============================================================

create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  role text not null default 'user',
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

-- Neue Felder für User
alter table profiles add column if not exists username text;
alter table profiles add column if not exists first_name text;
alter table profiles add column if not exists last_name text;
alter table profiles add column if not exists birthdate date;
alter table profiles add column if not exists bio text;
alter table profiles add column if not exists avatar_url text;

-- Neue Felder für Unternehmer
alter table profiles add column if not exists banner_url text;
alter table profiles add column if not exists company_name text;
alter table profiles add column if not exists contact_email text;

-- Eindeutiger Nutzername (erlaubt mehrere NULLs, z. B. bevor jemand einen gesetzt hat)
drop index if exists profiles_username_key;
create unique index profiles_username_key on profiles (username) where username is not null;

-- Erweiterte Rollen: user, business, admin, moderator, supporter, team
alter table profiles drop constraint if exists profiles_role_check;
alter table profiles add constraint profiles_role_check
  check (role in ('user', 'business', 'admin', 'moderator', 'supporter', 'team'));

drop policy if exists "Profiles are viewable by everyone" on profiles;
create policy "Profiles are viewable by everyone"
  on profiles for select
  using (true);

drop policy if exists "Users can update their own profile" on profiles;
create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Hilfsfunktion: Rolle des aktuell eingeloggten Users (für Policies weiter unten)
create or replace function public.current_role()
returns text
language sql
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- Automatisch ein Profil anlegen, sobald sich jemand registriert.
-- Liest alle Felder aus den Metadaten, die beim signUp() mitgeschickt werden.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id, role, display_name, username, first_name, last_name, birthdate,
    company_name, contact_email
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'user'),
    coalesce(
      new.raw_user_meta_data->>'display_name',
      new.raw_user_meta_data->>'username',
      new.raw_user_meta_data->>'company_name',
      new.email
    ),
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    nullif(new.raw_user_meta_data->>'birthdate', '')::date,
    new.raw_user_meta_data->>'company_name',
    new.raw_user_meta_data->>'contact_email'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 2. STANDORTE: mehrere Adressen pro Unternehmer-Account
-- ============================================================

create table if not exists business_locations (
  id uuid default gen_random_uuid() primary key,
  business_id uuid references profiles(id) on delete cascade not null,
  label text,
  address text not null,
  created_at timestamptz not null default now()
);

alter table business_locations enable row level security;

drop policy if exists "Locations are viewable by everyone" on business_locations;
create policy "Locations are viewable by everyone"
  on business_locations for select
  using (true);

drop policy if exists "Business manages own locations" on business_locations;
create policy "Business manages own locations"
  on business_locations for all
  using (business_id = auth.uid())
  with check (business_id = auth.uid());

-- ============================================================
-- 3. EVENTS: echte Tabelle statt Mock-Daten
-- ============================================================

create table if not exists events (
  id uuid default gen_random_uuid() primary key,
  business_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  location text not null,
  event_date date not null,
  event_time time not null,
  age_limit int not null default 0,
  price text,
  drink_menu text,
  banner_url text,
  created_at timestamptz not null default now()
);

alter table events enable row level security;

drop policy if exists "Events are viewable by everyone" on events;
create policy "Events are viewable by everyone"
  on events for select
  using (true);

drop policy if exists "Business can create own events" on events;
create policy "Business can create own events"
  on events for insert
  with check (
    business_id = auth.uid()
    and public.current_role() in ('business', 'admin')
  );

drop policy if exists "Owner or staff can update events" on events;
create policy "Owner or staff can update events"
  on events for update
  using (
    business_id = auth.uid()
    or public.current_role() in ('admin', 'moderator')
  );

drop policy if exists "Owner or staff can delete events" on events;
create policy "Owner or staff can delete events"
  on events for delete
  using (
    business_id = auth.uid()
    or public.current_role() in ('admin', 'moderator')
  );

-- ============================================================
-- 4. RATINGS: Bewertungen (aus v1) + bearbeiten/löschen erlauben
-- ============================================================

create table if not exists ratings (
  id uuid default gen_random_uuid() primary key,
  event_id text not null,
  user_id uuid references profiles(id) on delete cascade not null,
  stars int not null check (stars between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

alter table ratings enable row level security;

drop policy if exists "Ratings are viewable by everyone" on ratings;
create policy "Ratings are viewable by everyone"
  on ratings for select
  using (true);

drop policy if exists "Users can insert their own ratings" on ratings;
create policy "Users can insert their own ratings"
  on ratings for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own ratings" on ratings;
create policy "Users can update their own ratings"
  on ratings for update
  using (auth.uid() = user_id);

drop policy if exists "Staff can update any rating" on ratings;
create policy "Staff can update any rating"
  on ratings for update
  using (public.current_role() in ('admin', 'moderator'));

drop policy if exists "Users can delete their own ratings" on ratings;
create policy "Users can delete their own ratings"
  on ratings for delete
  using (auth.uid() = user_id);

drop policy if exists "Staff can delete any rating" on ratings;
create policy "Staff can delete any rating"
  on ratings for delete
  using (public.current_role() in ('admin', 'moderator'));

-- ============================================================
-- 5. STORAGE: Buckets für Profilbilder, Banner, Event-Medien
-- ============================================================

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('banners', 'banners', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('event-media', 'event-media', true)
on conflict (id) do nothing;

-- Avatare: öffentlich lesbar, jede:r darf nur im eigenen Ordner (Ordnername = eigene User-ID) hochladen
drop policy if exists "Public read avatars" on storage.objects;
create policy "Public read avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "Users manage own avatar" on storage.objects;
create policy "Users manage own avatar"
  on storage.objects for all
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- Banner: gleiches Prinzip
drop policy if exists "Public read banners" on storage.objects;
create policy "Public read banners"
  on storage.objects for select
  using (bucket_id = 'banners');

drop policy if exists "Users manage own banner" on storage.objects;
create policy "Users manage own banner"
  on storage.objects for all
  using (bucket_id = 'banners' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'banners' and (storage.foldername(name))[1] = auth.uid()::text);

-- Event-Medien: öffentlich lesbar, nur Unternehmer/Admin dürfen in ihren eigenen Ordner hochladen
drop policy if exists "Public read event media" on storage.objects;
create policy "Public read event media"
  on storage.objects for select
  using (bucket_id = 'event-media');

drop policy if exists "Business manages own event media" on storage.objects;
create policy "Business manages own event media"
  on storage.objects for all
  using (
    bucket_id = 'event-media'
    and (storage.foldername(name))[1] = auth.uid()::text
    and public.current_role() in ('business', 'admin')
  )
  with check (
    bucket_id = 'event-media'
    and (storage.foldername(name))[1] = auth.uid()::text
    and public.current_role() in ('business', 'admin')
  );
