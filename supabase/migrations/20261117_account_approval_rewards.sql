-- Run once in Supabase SQL Editor before deploying this feature.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  status text not null default 'pending' check (status in ('pending','approved','rejected','suspended')),
  role text not null default 'customer' check (role in ('customer','master')),
  approved_at timestamptz,
  approved_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.loyalty_accounts (
  customer_id uuid primary key references public.profiles(id) on delete cascade,
  points_balance integer not null default 0 check (points_balance >= 0),
  updated_at timestamptz not null default now()
);
create table if not exists public.loyalty_ledger (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  order_id uuid unique,
  points integer not null check (points > 0),
  reason text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  order_id uuid unique,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  invoice_number text not null unique,
  status text not null default 'issued' check (status in ('issued','paid','void')),
  total_cents integer not null check (total_cents >= 0),
  currency text not null default 'CAD',
  issued_at timestamptz not null default now(),
  paid_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.orders add column if not exists paid_at timestamptz;
alter table public.orders add column if not exists total_cents integer;
alter table public.orders add column if not exists currency text default 'CAD';

create schema if not exists private;
create or replace function private.is_master()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'master' and status = 'approved');
$$;
revoke all on function private.is_master() from public;
grant usage on schema private to authenticated;
grant execute on function private.is_master() to authenticated;

create or replace function public.handle_new_ahgifts_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email, full_name, status, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'), 'pending', 'customer')
  on conflict (id) do nothing;
  insert into public.loyalty_accounts (customer_id) values (new.id) on conflict (customer_id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created_ahgifts on auth.users;
create trigger on_auth_user_created_ahgifts after insert on auth.users for each row execute procedure public.handle_new_ahgifts_user();

create or replace function public.apply_loyalty_entry()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.loyalty_accounts (customer_id, points_balance, updated_at) values (new.customer_id, new.points, now())
  on conflict (customer_id) do update set points_balance = public.loyalty_accounts.points_balance + excluded.points, updated_at = now();
  return new;
end;
$$;
drop trigger if exists on_loyalty_entry_added on public.loyalty_ledger;
create trigger on_loyalty_entry_added after insert on public.loyalty_ledger for each row execute procedure public.apply_loyalty_entry();

alter table public.profiles enable row level security;
alter table public.loyalty_accounts enable row level security;
alter table public.loyalty_ledger enable row level security;
alter table public.invoices enable row level security;
alter table public.orders enable row level security;
revoke all on public.profiles, public.loyalty_accounts, public.loyalty_ledger, public.invoices, public.orders from anon, authenticated;
grant select on public.profiles, public.loyalty_accounts, public.loyalty_ledger, public.invoices, public.orders to authenticated;
drop policy if exists profile_self_or_master on public.profiles;
create policy profile_self_or_master on public.profiles for select to authenticated using (id = (select auth.uid()) or (select private.is_master()));
drop policy if exists reward_self_or_master on public.loyalty_accounts;
create policy reward_self_or_master on public.loyalty_accounts for select to authenticated using (customer_id = (select auth.uid()) or (select private.is_master()));
drop policy if exists ledger_self_or_master on public.loyalty_ledger;
create policy ledger_self_or_master on public.loyalty_ledger for select to authenticated using (customer_id = (select auth.uid()) or (select private.is_master()));
drop policy if exists invoice_self_or_master on public.invoices;
create policy invoice_self_or_master on public.invoices for select to authenticated using (customer_id = (select auth.uid()) or (select private.is_master()));
drop policy if exists order_self_or_master on public.orders;
create policy order_self_or_master on public.orders for select to authenticated using (customer_id = (select auth.uid()) or (select private.is_master()));

-- After your first Google sign-in, replace the email below and run exactly once:
-- update public.profiles set role = 'master', status = 'approved', approved_at = now() where email = 'YOUR_GOOGLE_EMAIL';