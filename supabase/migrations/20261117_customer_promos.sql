create table if not exists public.customer_promos (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  code text not null,
  title text not null,
  description text,
  discount_label text not null,
  active boolean not null default true,
  expires_at timestamptz,
  redeemed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (customer_id, code)
);

alter table public.customer_promos enable row level security;
revoke all on public.customer_promos from anon, authenticated;
grant select on public.customer_promos to authenticated;
drop policy if exists promo_self_or_master on public.customer_promos;
create policy promo_self_or_master on public.customer_promos
for select to authenticated
using (customer_id = (select auth.uid()) or (select private.is_master()));
