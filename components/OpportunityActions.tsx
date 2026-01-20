"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { PencilIcon, TrashIcon } from '@/components/icons'

export default function OpportunityActions({ id }: { id: string }) {
  const router = useRouter()

  async function handleDelete() {
    const ok = confirm('Delete this opportunity?')
    if (!ok) return
    const { error } = await supabase.from('opportunities').delete().eq('id', id)
    if (error) {
      alert(error.message)
      return
    }
    router.refresh()
  }

  return (
    <div className="flex items-center gap-1">
      <Link href={`/opportunity/${id}`} title="Edit" aria-label="Edit" className="icon-btn">
        <PencilIcon width={18} height={18} />
      </Link>
      <button onClick={handleDelete} title="Delete" aria-label="Delete" className="icon-btn text-red-600 hover:text-red-700">
        <TrashIcon width={18} height={18} />
      </button>
    </div>
  )
}
