-- Pulsestate — Supabase Schema
-- Diesen kompletten Inhalt im Supabase Dashboard unter "SQL Editor" -> "New query" einfügen und ausführen.

-- 1. Profile-Tabelle: ein Profil pro Nutzer (User oder Unternehmer)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  role text not null default 'user' check (role in ('user', 'business')),
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

drop policy if exists "Profiles are viewable by everyone" on profiles;
create policy "Profiles are viewable by everyone"
  on profiles for select
  using (true);

drop policy if exists "Users can update their own profile" on profiles;
create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- 2. Automatisch ein Profil anlegen, sobald sich jemand registriert
-- (liest display_name/role aus den Metadaten, die beim signUp() mitgeschickt werden)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', new.email),
    coalesce(new.raw_user_meta_data->>'role', 'user')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Bewertungen (aktuell an die Mock-Event-IDs aus src/lib/events.js gekoppelt,
--    funktioniert genauso, sobald Events aus einer echten Tabelle kommen)
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
