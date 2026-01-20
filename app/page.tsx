import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Opportunity } from '@/types/opportunity'
import SetupNotice from '@/components/SetupNotice'
import OpportunityActions from '@/components/OpportunityActions'
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

  function sortLink(key: keyof typeof sortable, label: string) {
    const active = column === sortable[key]
    const nextDir = !active ? 'asc' : (ascending ? 'desc' : 'asc')
    const icon = !active ? null : ascending ? <ArrowUpIcon width={14} height={14}/> : <ArrowDownIcon width={14} height={14}/>
    const href = `/?sort=${key}&dir=${nextDir}`
    return (
      <Link href={href} className={`inline-flex items-center gap-1 hover:underline ${active ? 'text-gray-900' : 'text-gray-600'}`}>
        {label}
        {icon}
      </Link>
    )
  }

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
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <div className="flex items-center justify-between">
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

      {opportunities.length === 0 ? (
        <div className="text-gray-500">No opportunities yet. Create one to get started.</div>
      ) : (
        <div className="grid gap-4">
          {opportunities.map((o) => (
            <OpportunityCard key={o.id} opp={o} />
          ))}
        </div>
      )}
    </div>
  )
}
