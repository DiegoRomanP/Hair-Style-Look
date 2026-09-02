create extension if not exists "pgcrypto";

create type public.salon_status as enum ('trial', 'active', 'suspended');
create type public.salon_member_role as enum ('owner', 'admin', 'stylist');
create type public.service_category as enum ('cut', 'color', 'treatment', 'styling');
create type public.hairstyle_length as enum ('very_short', 'short', 'medium', 'long');
create type public.maintenance_level as enum ('low', 'medium', 'high');
create type public.change_level as enum ('subtle', 'medium', 'radical');
create type public.consultation_status as enum (
  'draft',
  'awaiting_consent',
  'awaiting_photo',
  'awaiting_answers',
  'ready_to_generate',
  'generating',
  'results_ready',
  'generation_failed',
  'look_selected',
  'stylist_reviewed',
  'completed',
  'cancelled',
  'expired'
);

create table public.salons (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 1 and 160),
  status public.salon_status not null default 'trial',
  timezone text not null default 'America/Lima',
  currency text not null default 'PEN' check (currency ~ '^[A-Z]{3}$'),
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.salon_members (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  auth_user_id uuid not null references auth.users(id) on delete cascade,
  role public.salon_member_role not null,
  display_name text not null check (char_length(display_name) between 1 and 120),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (salon_id, auth_user_id),
  unique (salon_id, id)
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 160),
  description text not null default '',
  category public.service_category not null,
  duration_minutes integer not null check (duration_minutes > 0 and duration_minutes <= 1440),
  price_minor integer not null check (price_minor >= 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.hairstyles (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete cascade,
  code text not null check (code ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 1 and 160),
  description text not null default '',
  version integer not null default 1 check (version > 0),
  audience_tags text[] not null default '{}',
  length public.hairstyle_length not null,
  texture_compatibility text[] not null default '{}',
  maintenance_level public.maintenance_level not null,
  change_level public.change_level not null,
  reference_asset_path text,
  prompt_template text not null default '',
  negative_constraints jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (salon_id, code, version)
);

create table public.consultations (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons(id) on delete restrict,
  public_token_hash text not null unique check (char_length(public_token_hash) >= 64),
  status public.consultation_status not null default 'awaiting_consent',
  selected_look_result_id uuid,
  assigned_stylist_member_id uuid,
  expires_at timestamptz not null,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (expires_at > created_at),
  check ((status <> 'completed') or completed_at is not null),
  foreign key (salon_id, assigned_stylist_member_id)
    references public.salon_members(salon_id, id)
    on delete restrict
);

create index salon_members_salon_id_idx on public.salon_members(salon_id);
create index services_salon_id_active_idx on public.services(salon_id, active);
create index hairstyles_salon_id_active_idx on public.hairstyles(salon_id, active);
create index consultations_salon_id_status_idx on public.consultations(salon_id, status);
create index consultations_expires_at_idx on public.consultations(expires_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger salons_set_updated_at
before update on public.salons
for each row execute function public.set_updated_at();

create trigger salon_members_set_updated_at
before update on public.salon_members
for each row execute function public.set_updated_at();

create trigger services_set_updated_at
before update on public.services
for each row execute function public.set_updated_at();

create trigger hairstyles_set_updated_at
before update on public.hairstyles
for each row execute function public.set_updated_at();

create trigger consultations_set_updated_at
before update on public.consultations
for each row execute function public.set_updated_at();

create or replace function public.is_active_salon_member(target_salon_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.salon_members member
    where member.salon_id = target_salon_id
      and member.auth_user_id = auth.uid()
      and member.active
  );
$$;

create or replace function public.has_salon_role(
  target_salon_id uuid,
  allowed_roles public.salon_member_role[]
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.salon_members member
    where member.salon_id = target_salon_id
      and member.auth_user_id = auth.uid()
      and member.active
      and member.role = any(allowed_roles)
  );
$$;

alter table public.salons enable row level security;
alter table public.salon_members enable row level security;
alter table public.services enable row level security;
alter table public.hairstyles enable row level security;
alter table public.consultations enable row level security;

create policy "members can view their salon"
on public.salons for select
to authenticated
using (public.is_active_salon_member(id));

create policy "owners and admins can update their salon"
on public.salons for update
to authenticated
using (public.has_salon_role(id, array['owner', 'admin']::public.salon_member_role[]))
with check (public.has_salon_role(id, array['owner', 'admin']::public.salon_member_role[]));

create policy "members can view members in their salon"
on public.salon_members for select
to authenticated
using (public.is_active_salon_member(salon_id));

create policy "owners and admins manage members in their salon"
on public.salon_members for all
to authenticated
using (public.has_salon_role(salon_id, array['owner', 'admin']::public.salon_member_role[]))
with check (public.has_salon_role(salon_id, array['owner', 'admin']::public.salon_member_role[]));

create policy "members can view services in their salon"
on public.services for select
to authenticated
using (public.is_active_salon_member(salon_id));

create policy "owners and admins manage services in their salon"
on public.services for all
to authenticated
using (public.has_salon_role(salon_id, array['owner', 'admin']::public.salon_member_role[]))
with check (public.has_salon_role(salon_id, array['owner', 'admin']::public.salon_member_role[]));

create policy "members can view hairstyles in their salon"
on public.hairstyles for select
to authenticated
using (public.is_active_salon_member(salon_id));

create policy "owners and admins manage hairstyles in their salon"
on public.hairstyles for all
to authenticated
using (public.has_salon_role(salon_id, array['owner', 'admin']::public.salon_member_role[]))
with check (public.has_salon_role(salon_id, array['owner', 'admin']::public.salon_member_role[]));

create policy "members can view consultations in their salon"
on public.consultations for select
to authenticated
using (public.is_active_salon_member(salon_id));

create policy "staff can update consultations in their salon"
on public.consultations for update
to authenticated
using (public.is_active_salon_member(salon_id))
with check (public.is_active_salon_member(salon_id));
