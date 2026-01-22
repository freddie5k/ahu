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
import ResizableTable from '@/components/ResizableTable'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Search = { [key: string]: string | string[] | undefined }

export default async function Home({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams
  const sortParam = (typeof sp?.sort === 'string' ? sp.sort : undefined) ?? 'updated_at'
  const dirParam = (typeof sp?.dir === 'string' ? sp.dir : undefined) ?? 'desc'

  const sortable: Record<string, string> = {
    title: 'title',
    bu: 'bu',
    site: 'site',
    status: 'status',
    priority: 'priority',
    target_close_date: 'target_close_date',
    owner_name: 'owner_name',
    number_of_units: 'number_of_units',
    air_flow_m3h: 'air_flow_m3h',
    price_eur: 'price_eur',
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
    <div className="mx-auto max-w-[98%] px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            AHU Opportunity Tracker
          </h1>
          <p className="mt-1 text-sm text-gray-600">Track and manage your AHU opportunities</p>
        </div>
        <div className="flex gap-2">
          <Link href="/upload-data" className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 text-white text-sm font-medium px-5 py-2.5 hover:bg-green-700 shadow-sm hover:shadow-md transition-all duration-150">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Upload Excel
          </Link>
          <Link href="/new" className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white text-sm font-medium px-5 py-2.5 hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-150">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Opportunity
          </Link>
        </div>
      </div>

      {missingTable ? (
        <SetupNotice />
      ) : error ? (
        <div className="rounded bg-red-50 text-red-700 p-3 text-sm">{error.message}</div>
      ) : null}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-lg px-4 py-3 border border-gray-200/60 shadow-sm">
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
          <span className="inline-flex items-center rounded-md bg-white px-2.5 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-300/50 shadow-sm">
            {ascending ? '↑ Ascending' : '↓ Descending'}
          </span>
        </div>
        <SortControls />
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {opportunities.length === 0 ? (
          <div className="rounded-xl bg-white shadow-lg ring-1 ring-gray-200/50 p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-300 mb-3">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            <p className="text-gray-500 font-medium">No opportunities yet</p>
            <p className="text-sm text-gray-400 mt-1">Create one to get started</p>
          </div>
        ) : (
          opportunities.map((o) => (
            <div key={o.id} className="rounded-xl bg-white shadow-lg ring-1 ring-gray-200/60 p-4 space-y-3 hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="px-2.5 py-1.5 mb-2">
                    <EditableCell<any>
                      id={o.id}
                      column="title"
                      value={o.title}
                      kind="text"
                      className="font-semibold text-gray-900 bg-transparent border-transparent focus:ring-blue-500 focus:border-blue-500 text-base"
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

              <div className="text-sm">
                <div className="text-xs text-gray-500 mb-1">Price</div>
                <EditableCell<any> id={o.id} column="price_eur" value={o.price_eur} kind="number" className="numeric price-cell" placeholder="€" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-xl bg-white shadow-lg ring-1 ring-gray-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <ResizableTable>
            <thead className="bg-gradient-to-b from-gray-50 to-gray-100/50 border-b border-gray-200">
              <tr className="text-left text-gray-700 text-xs">
                <th className="px-3 py-2 font-semibold sticky left-0 bg-gray-50 z-10" style={{width: '200px'}}>{sortLink('title','Project Name')}</th>
                <th className="px-3 py-2 font-semibold" style={{width: '80px'}}>BU</th>
                <th className="px-3 py-2 font-semibold" style={{width: '100px'}}>Site</th>
                <th className="px-3 py-2 font-semibold" style={{width: '120px'}}>Owner</th>
                <th className="px-3 py-2 font-semibold" style={{width: '120px'}}>Status</th>
                <th className="px-3 py-2 font-semibold" style={{width: '110px'}}>Priority</th>
                <th className="px-3 py-2 font-semibold" style={{width: '120px'}}>Closing Date</th>
                <th className="px-3 py-2 font-semibold" style={{width: '200px'}}>Description</th>
                <th className="px-3 py-2 font-semibold" style={{width: '100px'}}>Air Flow (m³/h)</th>
                <th className="px-3 py-2 font-semibold" style={{width: '80px'}}>Units</th>
                <th className="px-3 py-2 font-semibold" style={{width: '90px'}}>DSS/DSP</th>
                <th className="px-3 py-2 font-semibold" style={{width: '130px'}}>Transfer Cost (OH)</th>
                <th className="px-3 py-2 font-semibold" style={{width: '150px'}}>Transfer Cost Complete</th>
                <th className="px-3 py-2 font-semibold" style={{width: '110px'}}>Vortice Price</th>
                <th className="px-3 py-2 font-semibold" style={{width: '110px'}}>Selling Price</th>
                <th className="px-3 py-2 font-semibold" style={{width: '150px'}}>Comments</th>
                <th className="px-3 py-2 font-semibold" style={{width: '80px'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.length === 0 ? (
                <tr>
                  <td colSpan={17} className="px-4 py-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-300 mb-3">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    <p className="text-gray-500 font-medium">No opportunities yet</p>
                    <p className="text-sm text-gray-400 mt-1">Create one to get started</p>
                  </td>
                </tr>
              ) : (
                opportunities.map((o) => (
                  <tr key={o.id} className="group hover:bg-gradient-to-r hover:from-blue-50/40 hover:to-blue-50/20 transition-all duration-200 border-b border-gray-100 last:border-b-0 text-xs">
                    <td className="px-3 py-2 sticky left-0 bg-white group-hover:bg-blue-50/40 z-10">
                      <EditableCell<any>
                        id={o.id}
                        column="title"
                        value={o.title}
                        kind="text"
                        className="font-semibold text-gray-900 bg-transparent border-transparent focus:ring-blue-500 focus:border-blue-500 text-xs"
                      />
                    </td>
                    <td className="px-3 py-2"><EditableCell<any> id={o.id} column="bu" value={o.bu} kind="text" className="text-xs" /></td>
                    <td className="px-3 py-2"><EditableCell<any> id={o.id} column="site" value={o.site} kind="text" className="text-xs" /></td>
                    <td className="px-3 py-2"><EditableCell<any> id={o.id} column="owner_name" value={o.owner_name} kind="text" className="text-xs" /></td>
                    <td className="px-3 py-2"><EditableStatusCell id={o.id} value={o.status} /></td>
                    <td className="px-3 py-2"><EditablePriorityCell id={o.id} value={o.priority} /></td>
                    <td className="px-3 py-2"><EditableCell<any> id={o.id} column="target_close_date" value={o.target_close_date} kind="date" className="text-xs" /></td>
                    <td className="px-3 py-2"><EditableCell<any> id={o.id} column="description" value={o.description} kind="text" className="text-xs" /></td>
                    <td className="px-3 py-2"><EditableCell<any> id={o.id} column="air_flow_m3h" value={o.air_flow_m3h} kind="number" className="numeric text-xs" /></td>
                    <td className="px-3 py-2"><EditableCell<any> id={o.id} column="number_of_units" value={o.number_of_units} kind="number" className="numeric text-xs" /></td>
                    <td className="px-3 py-2"><EditableCell<any> id={o.id} column="dss_dsp_design" value={o.dss_dsp_design} kind="text" className="text-xs" /></td>
                    <td className="px-3 py-2"><EditableCell<any> id={o.id} column="transfer_cost_without_oh_profit_8_per_u" value={o.transfer_cost_without_oh_profit_8_per_u} kind="number" className="numeric text-xs" placeholder="€" /></td>
                    <td className="px-3 py-2"><EditableCell<any> id={o.id} column="transfer_cost_complete_per_u" value={o.transfer_cost_complete_per_u} kind="number" className="numeric text-xs" placeholder="€" /></td>
                    <td className="px-3 py-2"><EditableCell<any> id={o.id} column="vortice_price" value={o.vortice_price} kind="number" className="numeric text-xs" placeholder="€" /></td>
                    <td className="px-3 py-2"><EditableCell<any> id={o.id} column="selling_price" value={o.selling_price} kind="number" className="numeric price-cell text-xs" placeholder="€" /></td>
                    <td className="px-3 py-2"><EditableCell<any> id={o.id} column="comments" value={o.comments} kind="text" className="text-xs" /></td>
                    <td className="px-3 py-2"><OpportunityActions id={o.id} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </ResizableTable>
        </div>
      </div>
    </div>
  )
}
