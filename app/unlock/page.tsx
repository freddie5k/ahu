export const dynamic = 'force-dynamic'

export default async function UnlockPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams
  const error = sp?.error
  const next = sp?.next || '/'
  const hasPassword = Boolean(process.env.APP_PASSWORD)

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-4 sm:py-6">
      <div className="card p-4 sm:p-6 space-y-4">
        <h1 className="text-lg sm:text-xl font-semibold">Enter Access Password</h1>
        {!hasPassword && (
          <div className="text-sm text-red-600">APP_PASSWORD is not set on the server. Set it in your environment to enable the gate.</div>
        )}
        {error && <div className="text-sm text-red-600">Invalid password. Try again.</div>}
        <form action="/api/unlock" method="post" className="space-y-3">
          <input type="hidden" name="next" value={next} />
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-700">Password</span>
            <input name="password" type="password" className="input" placeholder="Enter password" required />
          </label>
          <button className="btn-primary" type="submit">Unlock</button>
        </form>
      </div>
    </div>
  )
}
