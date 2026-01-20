import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Opportunity } from '@/types/opportunity'
import SetupNotice from '@/components/SetupNotice'

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

      <div className="grid gap-3">
        {opportunities.length === 0 && (
          <div className="text-gray-500">No opportunities yet. Create one to get started.</div>
        )}
        {opportunities.map((o) => (
          <Link key={o.id} href={`/opportunity/${o.id}`} className="card p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{o.title}</div>
                <div className="text-sm text-gray-600">{o.site} • {o.status} • {o.priority}</div>
              </div>
              <div className="text-right text-sm text-gray-600">
                {o.target_close_date ? new Date(o.target_close_date).toLocaleDateString() : '—'}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
