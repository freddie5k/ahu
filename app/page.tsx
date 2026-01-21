import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Opportunity } from '@/types/opportunity'
import SetupNotice from '@/components/SetupNotice'
import OpportunityActions from '@/components/OpportunityActions'
import EditableCell from '@/components/EditableCell'
import EditableStatusCell from '@/components/EditableStatusCell'
import EditablePriorityCell from '@/components/EditablePriorityCell'
import { ArrowDownIcon, ArrowUpIcon } from '@/components/icons'
import SortControls from '@/components/SortControls'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Search = { [key: string]: string | string[] | undefined }

export default async function Home({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams
  const sortParam = (typeof sp?.sort === 'string' ? sp.sort : undefined) ?? 'updated_at'
  const dirParam = (typeof sp?.dir === 'string' ? sp.dir : undefined) ?? 'desc'

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
    const href = `/?sort=${key}&dir=${nextDir}`
    return (
      <Link href={href} className={`inline-flex items-center gap-1 ${active ? 'text-gray-900' : 'text-gray-600'} hover:underline`}>
        {label}
        {active ? (ascending ? <ArrowUpIcon width={14} height={14}/> : <ArrowDownIcon width={14} height={14}/>) : null}
      </Link>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Opportunities</h1>
          <p className="mt-1 text-sm text-gray-600">Track and manage your AHU opportunities</p>
        </div>
        <Link href="/new" className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white text-sm font-medium px-5 py-2.5 hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-150">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Opportunity
        </Link>
      </div>

      {missingTable ? (
        <SetupNotice />
      ) : error ? (
        <div className="rounded bg-red-50 text-red-700 p-3 text-sm">{error.message}</div>
      ) : null}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
        <div className="flex items-center gap-2 flex-wrap">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
          <span className="text-sm text-gray-700 font-medium">Sorted by</span>
          <span className="text-sm text-gray-900 font-semibold">{sortParam}</span>
          <span className="inline-flex items-center rounded-md bg-white px-2 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-gray-300">
            {ascending ? '↑ Ascending' : '↓ Descending'}
          </span>
        </div>
        <SortControls />
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {opportunities.length === 0 ? (
          <div className="rounded-xl bg-white shadow-lg ring-1 ring-gray-200/50 p-6 text-center text-gray-500">
            No opportunities yet. Create one to get started.
          </div>
        ) : (
          opportunities.map((o) => (
            <div key={o.id} className="rounded-xl bg-white shadow-lg ring-1 ring-gray-200/50 p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 ring-1 ring-blue-300/50 px-2.5 py-1.5 shadow-sm mb-2">
                    <EditableCell<any>
                      id={o.id}
                      column="title"
                      value={o.title}
                      kind="text"
                      className="font-semibold text-blue-900 bg-transparent border-transparent focus:ring-blue-500 focus:border-blue-500 text-base"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    <EditableCell<any> id={o.id} column="site" value={o.site} kind="text" />
                  </div>
                </div>
                <OpportunityActions id={o.id} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Status</div>
                  <EditableStatusCell id={o.id} value={o.status} />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Priority</div>
                  <EditablePriorityCell id={o.id} value={o.priority} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Close Date</div>
                  <EditableCell<any> id={o.id} column="target_close_date" value={o.target_close_date} kind="date" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Owner</div>
                  <EditableCell<any> id={o.id} column="owner_name" value={o.owner_name} kind="text" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Savings</div>
                  <EditableCell<any> id={o.id} column="estimated_savings_usd" value={o.estimated_savings_usd} kind="number" className="numeric" placeholder="$" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Cost</div>
                  <EditableCell<any> id={o.id} column="estimated_cost_usd" value={o.estimated_cost_usd} kind="number" className="numeric" placeholder="$" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-xl bg-white shadow-lg ring-1 ring-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gradient-to-b from-gray-50 to-gray-100/50 sticky top-0 z-10 border-b border-gray-200">
              <tr className="text-left text-gray-700">
                <th className="px-4 py-3 font-semibold">{sortLink('title','Project Name')}</th>
                <th className="px-4 py-3 font-semibold">{sortLink('site','Site')}</th>
                <th className="px-4 py-3 font-semibold">{sortLink('status','Status')}</th>
                <th className="px-4 py-3 font-semibold">{sortLink('priority','Priority')}</th>
                <th className="px-4 py-3 font-semibold">{sortLink('target_close_date','Closing Date')}</th>
                <th className="px-4 py-3 font-semibold">{sortLink('owner_name','Owner')}</th>
                <th className="px-4 py-3 font-semibold">{sortLink('estimated_savings_usd','Savings ($)')}</th>
                <th className="px-4 py-3 font-semibold">{sortLink('estimated_cost_usd','Cost ($)')}</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-gray-500">No opportunities yet. Create one to get started.</td>
                </tr>
              ) : (
                opportunities.map((o) => (
                  <tr key={o.id} className="group hover:bg-blue-50/30 transition-colors duration-150 border-b border-gray-100 last:border-b-0">
                    <td className="px-4 py-3 w-[260px] max-w-[260px]">
                      <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 ring-1 ring-blue-300/50 px-2.5 py-1.5 shadow-sm">
                        <EditableCell<any>
                          id={o.id}
                          column="title"
                          value={o.title}
                          kind="text"
                          className="font-semibold text-blue-900 bg-transparent border-transparent focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 w-[160px]"><EditableCell<any> id={o.id} column="site" value={o.site} kind="text" /></td>
                    <td className="px-4 py-3 w-[150px]"><EditableStatusCell id={o.id} value={o.status} /></td>
                    <td className="px-4 py-3 w-[140px]"><EditablePriorityCell id={o.id} value={o.priority} /></td>
                    <td className="px-4 py-3 w-[150px]"><EditableCell<any> id={o.id} column="target_close_date" value={o.target_close_date} kind="date" /></td>
                    <td className="px-4 py-3 w-[180px]"><EditableCell<any> id={o.id} column="owner_name" value={o.owner_name} kind="text" /></td>
                    <td className="px-4 py-3 w-[140px]"><EditableCell<any> id={o.id} column="estimated_savings_usd" value={o.estimated_savings_usd} kind="number" className="numeric" placeholder="$" /></td>
                    <td className="px-4 py-3 w-[140px]"><EditableCell<any> id={o.id} column="estimated_cost_usd" value={o.estimated_cost_usd} kind="number" className="numeric" placeholder="$" /></td>
                    <td className="px-4 py-3"><OpportunityActions id={o.id} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
