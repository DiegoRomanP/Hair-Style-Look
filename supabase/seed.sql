insert into public.salons (id, slug, name, status, timezone, currency)
values (
  '11111111-1111-4111-8111-111111111111',
  'salon-piloto',
  'Salón Piloto',
  'active',
  'America/Lima',
  'PEN'
)
set name = excluded.name,
    status = excluded.status,
    timezone = excluded.timezone,
    currency = excluded.currency;

insert into public.services (
  id,
  salon_id,
  name,
  description,
  category,
  duration_minutes,
  price_minor,
  currency,
  active
)
values
  (
    '22222222-2222-4222-8222-222222222221',
    '11111111-1111-4111-8111-111111111111',
    'Corte y peinado',
    'Corte personalizado y acabado de peinado.',
    'cut',
    60,
    8500,
    'PEN',
    true
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111111',
    'Color y corte',
    'Servicio de color sujeto a evaluación profesional.',
    'color',
    150,
    22000,
    'PEN',
    true
  )
set name = excluded.name,
    description = excluded.description,
    duration_minutes = excluded.duration_minutes,
    price_minor = excluded.price_minor,
    active = excluded.active;

insert into public.hairstyles (
  id,
  salon_id,
  code,
  name,
  description,
  version,
  audience_tags,
  length,
  texture_compatibility,
  maintenance_level,
  change_level,
  active
)
values
  (
    '33333333-3333-4333-8333-333333333331',
    '11111111-1111-4111-8111-111111111111',
    'soft-layers',
    'Capas suaves',
    'Capas de movimiento moderado para una conversación con el estilista.',
    1,
    array['unisex'],
    'medium',
    array['straight', 'wavy'],
    'medium',
    'medium',
    true
  ),
  (
    '33333333-3333-4333-8333-333333333332',
    '11111111-1111-4111-8111-111111111111',
    'textured-crop',
    'Crop texturizado',
    'Corte corto texturizado, sujeto a adaptación profesional.',
    1,
    array['unisex'],
    'short',
    array['straight', 'wavy', 'curly'],
    'low',
    'medium',
    true
  )
on conflict (id) do update
set name = excluded.name,
    description = excluded.description,
    texture_compatibility = excluded.texture_compatibility,
    active = excluded.active;
