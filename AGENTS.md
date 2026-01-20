Context for Agents Working in This Repo

Project
- AHU Opportunities Tracker — internal tool to track AHU opportunities.
- Next.js 16 (App Router) + TypeScript + Tailwind; Supabase (Postgres).

Important Behaviors
- Next.js 16 dynamic APIs (searchParams/cookies/headers) are Promises in RSC. Always `await` them in server components.
- Sorting on `/` depends on awaiting `searchParams` and re-fetching from Supabase with `.order(column, { ascending })`.
- Number cells in the table are formatted to EUR strings for display; persist raw numbers.

Access / Security
- Temporary password gate via `middleware.ts` and `/unlock`. Cookie `ahu_auth=1` grants access.
- Set `APP_PASSWORD` in env for gate to work. Avoid committing secrets.
- Supabase RLS currently allows anon CRUD for testing. Do not keep for production.

Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` — project URL (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon public key (public but sensitive)
- `APP_PASSWORD` — temporary password for gate (secret)

Local Commands
- `npm run dev` — run locally.
- `/debug` — environment + connectivity check.

Key Files
- `app/page.tsx` — main table, sorting, inline editing.
- `components/EditableCell.tsx` — client cell editor; formats EUR numbers.
- `components/OpportunityActions.tsx` — row edit/delete actions.
- `components/icons.tsx` — small SVG icons.
- `app/unlock/page.tsx` + `app/api/unlock/route.ts` — password gate.
- `middleware.ts` — redirects to `/unlock` without cookie.
- `lib/supabase.ts` — Supabase client.
- `types/opportunity.ts` — TS types.

DB Schema
- `public.opportunities` with:
  - title, site, description, status, priority, target_close_date, owner_name,
  - estimated_savings_usd, estimated_cost_usd, created_at, updated_at
- Enums: `opportunity_status`, `opportunity_priority`
- Trigger: `trg_opportunities_updated` sets `updated_at`.

Coding Conventions
- Keep UI components small and client-only when they handle interactions.
- Avoid adding unrelated dependencies.
- Prefer Tailwind utility classes and existing helpers in `app/globals.css`.

Pending / Nice-to-haves
- Add quick filters (Status/Site/Owner) to the list.
- CSV export of current view.
- Migrate middleware to the new Next.js proxy convention.
- Replace password gate with Supabase Auth (Google/Microsoft) and tighten RLS.
- Activity log / comments (future).

