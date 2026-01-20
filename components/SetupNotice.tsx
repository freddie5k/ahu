export default function SetupNotice() {
  const sql = `create extension if not exists "pgcrypto";

do $$ begin
  if not exists (select 1 from pg_type where typname = 'opportunity_status') then
    create type opportunity_status as enum ('New','Qualified','Assessing','Quoted','Won','Lost','On Hold');
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_type where typname = 'opportunity_priority') then
    create type opportunity_priority as enum ('Low','Medium','High');
  end if;
end $$;

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  site text not null,
  description text,
  status opportunity_status not null default 'New',
  priority opportunity_priority not null default 'Medium',
  target_close_date date,
  owner_name text,
  estimated_savings_usd numeric(12,2),
  estimated_cost_usd numeric(12,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists trg_opportunities_updated on public.opportunities;
create trigger trg_opportunities_updated
before update on public.opportunities
for each row execute function set_updated_at();

alter table public.opportunities enable row level security;

drop policy if exists "anon can read" on public.opportunities;
create policy "anon can read"
on public.opportunities for select to anon using (true);

drop policy if exists "anon can insert" on public.opportunities;
create policy "anon can insert"
on public.opportunities for insert to anon with check (true);

drop policy if exists "anon can update" on public.opportunities;
create policy "anon can update"
on public.opportunities for update to anon using (true) with check (true);

drop policy if exists "anon can delete" on public.opportunities;
create policy "anon can delete"
on public.opportunities for delete to anon using (true);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.opportunities to anon, authenticated;`;

  return (
    <div className="card p-4 space-y-3">
      <div className="text-sm text-gray-800">
        <b>Setup needed:</b> The table <code>public.opportunities</code> was not found. Run the SQL below in Supabase → SQL editor, then reset API cache (Project Settings → API → Reset API cache) and reload this page.
      </div>
      <pre className="overflow-auto text-xs bg-gray-50 p-3 rounded border text-gray-800 whitespace-pre-wrap">
{sql}
      </pre>
    </div>
  )
}
