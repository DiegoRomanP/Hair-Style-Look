begin;

create extension if not exists pgtap with schema extensions;
set local search_path = extensions, public, auth;
select plan(8);

insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'owner-one@example.test',
    'not-used-in-test',
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(),
    now()
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'owner-two@example.test',
    'not-used-in-test',
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(),
    now()
  );

insert into public.salons (id, slug, name, status)
values
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'tenant-one', 'Tenant One', 'active'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 'tenant-two', 'Tenant Two', 'active');

insert into public.salon_members (salon_id, auth_user_id, role, display_name)
values
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'owner', 'Owner One'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'owner', 'Owner Two');

insert into public.services (salon_id, name, category, duration_minutes, price_minor, currency)
values
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'Tenant one service', 'cut', 30, 1000, 'PEN'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 'Tenant two service', 'cut', 30, 1000, 'PEN');

insert into public.hairstyles (
  salon_id,
  code,
  name,
  length,
  maintenance_level,
  change_level
)
values
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'tenant-one-style', 'Tenant One Style', 'short', 'low', 'subtle'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 'tenant-two-style', 'Tenant Two Style', 'short', 'low', 'subtle');

insert into public.consultations (salon_id, public_token_hash, expires_at)
values
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
    '1111111111111111111111111111111111111111111111111111111111111111',
    now() + interval '1 day'
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
    '2222222222222222222222222222222222222222222222222222222222222222',
    now() + interval '1 day'
  );

grant usage on schema extensions to authenticated;
grant execute on all functions in schema extensions to authenticated;

set local role authenticated;
select set_config('request.jwt.claim.sub', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', true);

select is(
  (select count(*) from public.services)::integer,
  1,
  'a salon member can read services only in its salon'
);

select is(
  (select count(*) from public.hairstyles)::integer,
  1,
  'a salon member can read hairstyles only in its salon'
);

select is(
  (select count(*) from public.consultations)::integer,
  1,
  'a salon member can read consultations only in its salon'
);

select is(
  (select count(*) from public.salons)::integer,
  1,
  'a salon member cannot enumerate other salons'
);

select is(
  (select count(*) from public.salon_members)::integer,
  1,
  'a salon member can read members only in its salon'
);

select lives_ok(
  $$insert into public.services (salon_id, name, category, duration_minutes, price_minor, currency)
    values ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'Allowed service', 'cut', 30, 1000, 'PEN')$$,
  'an owner can create a service for its own salon'
);

select throws_ok(
  $$insert into public.services (salon_id, name, category, duration_minutes, price_minor, currency)
    values ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 'Denied service', 'cut', 30, 1000, 'PEN')$$,
  '42501',
  null,
  'an owner cannot create a service for another salon'
);

select is(
  (select count(*) from public.services where name = 'Allowed service')::integer,
  1,
  'the permitted mutation is visible only to the owning salon'
);

select * from finish();
rollback;
