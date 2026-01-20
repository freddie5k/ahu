import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Opportunity } from '@/types/opportunity'
import SetupNotice from '@/components/SetupNotice'
import OpportunityActions from '@/components/OpportunityActions'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .order('updated_at', { ascending: false })
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

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="px-3 py-2 border-b">Project Name</th>
              <th className="px-3 py-2 border-b">Site</th>
              <th className="px-3 py-2 border-b">Status</th>
              <th className="px-3 py-2 border-b">Priority</th>
              <th className="px-3 py-2 border-b">Closing Date</th>
              <th className="px-3 py-2 border-b">Owner</th>
              <th className="px-3 py-2 border-b">Savings</th>
              <th className="px-3 py-2 border-b">Cost</th>
              <th className="px-3 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.length === 0 && (
              <tr>
                <td className="px-3 py-3 text-gray-500" colSpan={9}>No opportunities yet. Create one to get started.</td>
              </tr>
            )}
            {opportunities.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 border-b">
                  <Link href={`/opportunity/${o.id}`} className="text-blue-600 hover:underline">{o.title}</Link>
                </td>
                <td className="px-3 py-2 border-b">{o.site}</td>
                <td className="px-3 py-2 border-b">{o.status}</td>
                <td className="px-3 py-2 border-b">{o.priority}</td>
                <td className="px-3 py-2 border-b">{o.target_close_date ? new Date(o.target_close_date).toLocaleDateString() : '—'}</td>
                <td className="px-3 py-2 border-b">{o.owner_name ?? '—'}</td>
                <td className="px-3 py-2 border-b">{fmtMoney(o.estimated_savings_usd as any)}</td>
                <td className="px-3 py-2 border-b">{fmtMoney(o.estimated_cost_usd as any)}</td>
                <td className="px-3 py-2 border-b">
                  <OpportunityActions id={o.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
