import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Opportunity } from '@/types/opportunity'
import SetupNotice from '@/components/SetupNotice'
import SortControls from '@/components/SortControls'
import OpportunityCard from '@/components/OpportunityCard'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Search = { [key: string]: string | string[] | undefined }

export default async function Home({ searchParams }: { searchParams?: Search }) {
  const sortParam = (typeof searchParams?.sort === 'string' ? searchParams!.sort : undefined) ?? 'updated_at'
  const dirParam = (typeof searchParams?.dir === 'string' ? searchParams!.dir : undefined) ?? 'desc'

  const sortable: Record<string, string> = {
    title: 'title',
    site: 'site',
    status: 'status',
    priority: 'priority',
    target_close_date: 'target_close_date',
    owner_name: 'owner_name',
    estimated_savings_usd: 'estimated_savings_usd',
    estimated_cost_usd: 'estimated_cost_usd',
    updated_at: 'updated_at',
  }

  const column = sortable[sortParam] ?? 'updated_at'
  const ascending = (dirParam === 'asc')

  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .order(column, { ascending })
    .limit(50)

  const opportunities = (data as Opportunity[]) ?? []

  const missingTable = !!error && (
    error.message?.toLowerCase().includes('could not find the table') ||
    error.message?.toLowerCase().includes('schema cache') ||
    error.message?.toLowerCase().includes('relation')
  )

  function fmtMoney(n: number | null | undefined): string {
    if (n === null || n === undefined) return '—'
    try {
      return n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
    } catch {
      return `$${n}`
    }
  }

  // table sorting headers removed in favor of SortControls toolbar

  function statusBadge(v: string) {
    const map: Record<string,string> = {
      Won: 'badge badge-green',
      Quoted: 'badge badge-blue',
      Assessing: 'badge badge-yellow',
      Lost: 'badge badge-red',
      'On Hold': 'badge badge-gray',
      Qualified: 'badge badge-blue',
      New: 'badge badge-gray',
    }
    return <span className={map[v] ?? 'badge badge-gray'}>{v}</span>
  }

  function priorityBadge(v: string) {
    const map: Record<string,string> = {
      High: 'badge badge-red',
      Medium: 'badge badge-yellow',
      Low: 'badge badge-green',
    }
    return <span className={map[v] ?? 'badge badge-gray'}>{v}</span>
  }

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6">
      <div className="flex items-center justify-between px-3">
        <h1 className="text-2xl font-semibold">Opportunities</h1>
        <Link href="/new" className="btn-primary">New Opportunity</Link>
      </div>

      {missingTable ? (
        <SetupNotice />
      ) : error ? (
        <div className="rounded bg-red-50 text-red-700 p-3 text-sm">{error.message}</div>
      ) : null}

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">Sorted by {sortParam} ({ascending ? 'asc' : 'desc'})</div>
        <SortControls />
      </div>

      {/* Header legend for wide screens */}
      <div className="hidden md:block">
        <div className="card p-3">
          <div className="grid items-center gap-3 [grid-template-columns:2fr_1.2fr_1fr_1fr_1fr_1.2fr_1fr_1fr_auto]">
            <div className="muted-label">Project Name</div>
            <div className="muted-label">Site</div>
            <div className="muted-label">Status</div>
            <div className="muted-label">Priority</div>
            <div className="muted-label">Closing Date</div>
            <div className="muted-label">Owner</div>
            <div className="muted-label">Savings</div>
            <div className="muted-label">Cost</div>
            <div className="muted-label text-right">Actions</div>
          </div>
        </div>
      </div>

      {opportunities.length === 0 ? (
        <div className="text-gray-500">No opportunities yet. Create one to get started.</div>
      ) : (
        <div className="grid gap-3">
          {opportunities.map((o) => (
            <OpportunityCard key={o.id} opp={o} />
          ))}
        </div>
      )}
    </div>
  )
}
