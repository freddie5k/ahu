import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Opportunity } from '@/types/opportunity'
import SetupNotice from '@/components/SetupNotice'
import { ArrowDownIcon, ArrowUpIcon } from '@/components/icons'
import SortControls from '@/components/SortControls'
import FilterProvider from '@/components/FilterProvider'
import TableViews from '@/components/TableViews'

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

      <FilterProvider opportunities={opportunities}>
        <TableViews column={column} ascending={ascending} sortable={sortable} />
      </FilterProvider>
    </div>
  )
}
