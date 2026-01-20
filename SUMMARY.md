AHU Opportunities Tracker — Project Summary

Purpose
- Internal app to track AHU opportunities. Modern, simple UI with inline editing and sorting.

Stack
- Next.js 16 (App Router, TypeScript, Tailwind)
- Supabase (Postgres + RLS; anon enabled for dev)
- Deployment: Vercel (app), Supabase (DB)

Current State (2026-01-20)
- CRUD: Create, list, inline edit, and delete opportunities.
- List UI: Compact, modern table with sticky header, hover highlight, and per-cell inline editing.
- Sorting: Clickable header titles and a sort toolbar (column + asc/desc). Uses URL `?sort=...&dir=...`.
- Formatting: Savings/Cost display as EUR with thousand separators (persisted as numeric in DB).
- Highlight: Project Name cell is visually emphasized (blue background + ring).
- Access: Simple password gate enabled via middleware + `/unlock` (sets `ahu_auth=1` cookie for 12h).

Key Routes
- `/` — main table
- `/new` — create form
- `/opportunity/[id]` — detail/edit page
- `/unlock` — password page (posts to `/api/unlock`)
- `/api/unlock` — sets cookie and redirects back
- `/debug` — environment + Supabase connectivity check

Environment
- Required env vars (local and Vercel):
  - `NEXT_PUBLIC_SUPABASE_URL=https://yppyzmjpwrxjaxlsrpio.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon public key>`
  - `APP_PASSWORD=<temporary password for gate>`
- Copy `.env.local.example` → `.env.local` and fill values.

Database
- Table: `public.opportunities` with enums `opportunity_status`, `opportunity_priority`.
- `updated_at` trigger auto-updates on modifications.
- Dev RLS: anon CRUD allowed (OK for testing only). See README for SQL to (re)create.

Known Notes
- Next.js 16 dynamic APIs: `searchParams` is a Promise; code awaits it on the server.
- Middleware: current `middleware.ts` works but Next.js warns to migrate to the new "proxy" config later.

Open TODOs / Next Steps
- Filters: Add quick filters for Status, Site, and Owner above the table.
- Export: CSV export for current view/sort.
- Gate UX: Add a small "Lock" action to clear cookie (log out) and jump to `/unlock`.
- Visual: Optional left accent bar on Project Name, zebra striping, and density toggle (Compact/Comfortable).
- Auth hardening: Swap password gate for Supabase Auth (Google/Microsoft SSO) and tighten RLS to `authenticated`.
- Audit: Add history of status changes and comments (later feature).
- Migrate: Replace middleware with the new Next.js “proxy” when we stabilize.

How To Verify Quickly
1) `/debug` shows env present and a successful Supabase query.
2) `/unlock` accepts `APP_PASSWORD` and redirects to `/`.
3) On `/`, edit cells inline (blur to save); sort via headers or toolbar.

Contact Points (for future work)
- Sorting keys supported: `title`, `site`, `status`, `priority`, `target_close_date`, `owner_name`, `estimated_savings_usd`, `estimated_cost_usd`, `updated_at`.
- Financial formatting: client-side, currency=EUR, max fraction digits=0.

