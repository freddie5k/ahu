import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import OpportunityForm from '@/components/OpportunityForm'
import type { Opportunity } from '@/types/opportunity'

type Props = { params: Promise<{ id: string }> }

export default async function OpportunityPage({ params }: Props) {
  const { id } = await params
  const { data, error } = await supabase.from('opportunities').select('*').eq('id', id).single()
  if (error || !data) return notFound()
  const opp = data as Opportunity

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-semibold">Edit Opportunity</h1>
        <div className="flex gap-2">
          <Link href="/" className="btn-secondary text-sm">Back</Link>
          <form action={`/opportunity/${opp.id}/delete`}>
            <DeleteButton id={opp.id} />
          </form>
        </div>
      </div>

      <OpportunityForm mode="edit" initial={opp} />
    </div>
  )
}

function DeleteButton({ id }: { id: string }) {
  async function handleDelete() {
    'use server'
    await supabase.from('opportunities').delete().eq('id', id)
  }

  return (
    <button formAction={handleDelete} className="btn-secondary text-sm" aria-label="Delete opportunity">
      Delete
    </button>
  )
}
export const dynamic = 'force-dynamic'
export const revalidate = 0
