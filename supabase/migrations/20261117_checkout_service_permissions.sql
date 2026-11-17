-- Server routes use the Supabase service role after authenticating and
-- authorizing the current customer or master account. Grants are still
-- required even though the service role bypasses RLS.
grant usage on schema public to service_role;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles',
    'loyalty_accounts',
    'loyalty_ledger',
    'orders',
    'invoices',
    'catalog_items',
    'customer_promos'
  ] loop
    if to_regclass('public.' || table_name) is not null then
      execute format(
        'grant select, insert, update, delete on table public.%I to service_role',
        table_name
      );
    end if;
  end loop;
end $$;
