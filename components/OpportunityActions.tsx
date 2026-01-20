"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

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
    <div className="flex items-center gap-3">
      <Link href={`/opportunity/${id}`} title="Edit" className="text-blue-600 hover:underline" aria-label="Edit">
        ✏️
      </Link>
      <button onClick={handleDelete} title="Delete" className="text-red-600" aria-label="Delete">
        🗑️
      </button>
    </div>
  )
}

