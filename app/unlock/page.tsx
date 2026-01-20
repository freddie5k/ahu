import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

async function unlock(formData: FormData) {
  'use server'
  const pwd = formData.get('password')?.toString() ?? ''
  const expected = process.env.APP_PASSWORD ?? ''
  const next = formData.get('next')?.toString() || '/'
  if (expected && pwd === expected) {
    cookies().set('ahu_auth', '1', { httpOnly: true, secure: true, path: '/', maxAge: 60 * 60 * 12 })
    redirect(next)
  }
  redirect(`/unlock?error=1&next=${encodeURIComponent(next)}`)
}

export default async function UnlockPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams
  const error = sp?.error
  const next = sp?.next || '/'
  const hasPassword = Boolean(process.env.APP_PASSWORD)

  return (
    <div className="mx-auto max-w-md p-6">
      <div className="card p-6 space-y-4">
        <h1 className="text-xl font-semibold">Enter Access Password</h1>
        {!hasPassword && (
          <div className="text-sm text-red-600">APP_PASSWORD is not set on the server. Set it in your environment to enable the gate.</div>
        )}
        {error && <div className="text-sm text-red-600">Invalid password. Try again.</div>}
        <form action={unlock} className="space-y-3">
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

