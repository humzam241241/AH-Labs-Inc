-- Enforce exactly one eligible AH Gifts master identity.
-- Safe to run before or after this Google account signs in.

update public.profiles
set role = 'customer', updated_at = now()
where role = 'master'
  and lower(coalesce(email, '')) <> 'mystrey827@gmail.com';

update public.profiles
set role = 'master',
    status = 'approved',
    approved_at = coalesce(approved_at, now()),
    updated_at = now()
where lower(email) = 'mystrey827@gmail.com';

create unique index if not exists profiles_single_master_idx
on public.profiles ((role))
where role = 'master';

create or replace function public.handle_new_ahgifts_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  is_owner boolean := lower(coalesce(new.email, '')) = 'mystrey827@gmail.com';
begin
  insert into public.profiles (id, email, full_name, status, role, approved_at)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    case when is_owner then 'approved' else 'pending' end,
    case when is_owner then 'master' else 'customer' end,
    case when is_owner then now() else null end
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = coalesce(public.profiles.full_name, excluded.full_name),
      status = case when is_owner then 'approved' else public.profiles.status end,
      role = case when is_owner then 'master' else public.profiles.role end,
      approved_at = case when is_owner then coalesce(public.profiles.approved_at, now()) else public.profiles.approved_at end,
      updated_at = now();

  insert into public.loyalty_accounts (customer_id)
  values (new.id)
  on conflict (customer_id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_ahgifts_user() from public, anon, authenticated;
