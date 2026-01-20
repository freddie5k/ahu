import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Opportunity } from '@/types/opportunity'
import SetupNotice from '@/components/SetupNotice'
import OpportunityActions from '@/components/OpportunityActions'
import EditableCell from '@/components/EditableCell'
import { ArrowDownIcon, ArrowUpIcon } from '@/components/icons'

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
    const href = `/?sort=${key}&dir=${nextDir}`
    return (
      <Link href={href} className={`inline-flex items-center gap-1 ${active ? 'text-gray-900' : 'text-gray-600'} hover:underline`}>
        {label}
        {active ? (ascending ? <ArrowUpIcon width={14} height={14}/> : <ArrowDownIcon width={14} height={14}/>) : null}
      </Link>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Opportunities</h1>
        <Link href="/new" className="btn-primary">New Opportunity</Link>
      </div>

      {missingTable ? (
        <SetupNotice />
      ) : error ? (
        <div className="rounded bg-red-50 text-red-700 p-3 text-sm">{error.message}</div>
      ) : null}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="text-left text-gray-700">
                <th className="px-3 py-2">{sortLink('title','Project Name')}</th>
                <th className="px-3 py-2">{sortLink('site','Site')}</th>
                <th className="px-3 py-2">{sortLink('status','Status')}</th>
                <th className="px-3 py-2">{sortLink('priority','Priority')}</th>
                <th className="px-3 py-2">{sortLink('target_close_date','Closing Date')}</th>
                <th className="px-3 py-2">{sortLink('owner_name','Owner')}</th>
                <th className="px-3 py-2">{sortLink('estimated_savings_usd','Savings')}</th>
                <th className="px-3 py-2">{sortLink('estimated_cost_usd','Cost')}</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {opportunities.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-3 py-4 text-gray-500">No opportunities yet. Create one to get started.</td>
                </tr>
              ) : (
                opportunities.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 w-[260px] max-w-[260px]"><EditableCell<any> id={o.id} column="title" value={o.title} kind="text" /></td>
                    <td className="px-3 py-2 w-[160px]"><EditableCell<any> id={o.id} column="site" value={o.site} kind="text" /></td>
                    <td className="px-3 py-2 w-[150px]"><EditableCell<any> id={o.id} column="status" value={o.status} kind="select" options={["New","Qualified","Assessing","Quoted","Won","Lost","On Hold"]} /></td>
                    <td className="px-3 py-2 w-[140px]"><EditableCell<any> id={o.id} column="priority" value={o.priority} kind="select" options={["Low","Medium","High"]} /></td>
                    <td className="px-3 py-2 w-[150px]"><EditableCell<any> id={o.id} column="target_close_date" value={o.target_close_date} kind="date" /></td>
                    <td className="px-3 py-2 w-[180px]"><EditableCell<any> id={o.id} column="owner_name" value={o.owner_name} kind="text" /></td>
                    <td className="px-3 py-2 w-[140px]"><EditableCell<any> id={o.id} column="estimated_savings_usd" value={o.estimated_savings_usd} kind="number" /></td>
                    <td className="px-3 py-2 w-[140px]"><EditableCell<any> id={o.id} column="estimated_cost_usd" value={o.estimated_cost_usd} kind="number" /></td>
                    <td className="px-3 py-2"><OpportunityActions id={o.id} /></td>
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
