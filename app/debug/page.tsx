import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DebugPage() {
  const envOk = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'missing'

  const { data, error } = await supabase.from('opportunities').select('*').limit(1)

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-4 sm:py-6 space-y-4">
      <h1 className="text-lg sm:text-xl font-semibold">Debug</h1>
      <div className="card p-3 sm:p-4 text-xs sm:text-sm space-y-2">
        <div>Env present: {String(envOk)}</div>
        <div>Project URL host: {projectUrl.replace('https://','')}</div>
        {error ? (
          <div className="text-red-600">Supabase error: {error.message}</div>
        ) : (
          <div className="text-green-700">Supabase query ok. Row count: {(data?.length ?? 0)}</div>
        )}
      </div>
      <div className="text-xs text-gray-600">If error mentions schema cache, reset in Supabase → Project Settings → API → Reset API cache, then reload.</div>
    </div>
  )
}

