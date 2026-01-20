import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const form = await request.formData()
  const pwd = (form.get('password') as string) || ''
  const next = ((form.get('next') as string) || '/') as string
  const expected = process.env.APP_PASSWORD || ''

  const url = new URL(next, request.url)
  const back = new URL(`/unlock?error=1&next=${encodeURIComponent(next)}`, request.url)

  if (expected && pwd === expected) {
    const res = NextResponse.redirect(url, { status: 303 })
    res.cookies.set('ahu_auth', '1', {
      httpOnly: true,
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 12,
      sameSite: 'lax',
    })
    return res
  }

  return NextResponse.redirect(back, { status: 303 })
}

