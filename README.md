AHU Opportunities Tracker — Next.js + Supabase

## Setup

1) Supabase
- Project URL: set `NEXT_PUBLIC_SUPABASE_URL` to your project URL (looks like `https://xxxx.supabase.co`).
- Anon key: in Supabase Dashboard → Project Settings → API → Project API keys → copy the `anon public` key. Set `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Create the table (run in Supabase SQL editor):

```
create extension if not exists "pgcrypto";

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
create policy "anon can read" on public.opportunities for select to anon using (true);

drop policy if exists "anon can insert" on public.opportunities;
create policy "anon can insert" on public.opportunities for insert to anon with check (true);

drop policy if exists "anon can update" on public.opportunities;
create policy "anon can update" on public.opportunities for update to anon using (true) with check (true);

drop policy if exists "anon can delete" on public.opportunities;
create policy "anon can delete" on public.opportunities for delete to anon using (true);
```

2) App env
- Copy `.env.local.example` → `.env.local` and fill values:

```
NEXT_PUBLIC_SUPABASE_URL=YOUR_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
APP_PASSWORD=choose-a-temporary-password
```

3) Run locally

```
npm run dev
```

Open `http://localhost:3000`.

## Deploy
- Vercel: add the two env vars above in Project Settings → Environment Variables; redeploy.
- Supabase: ensure the table and policies are created. For production, tighten RLS and add proper auth.
 - Optional: simple password gate — set `APP_PASSWORD` to enable the access gate at `/unlock`.

## Notes
- This MVP uses the anon key from the browser with permissive RLS for speed. Do not use this configuration for production.
- CRUD is implemented directly against Supabase from the client. We can switch to server actions and role-based auth next.
