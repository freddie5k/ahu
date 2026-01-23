"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { OpportunityStatus } from '@/types/opportunity'

interface EditableStatusCellProps {
  id: string
  value: OpportunityStatus
}

export default function EditableStatusCell({ id, value }: EditableStatusCellProps) {
  const [status, setStatus] = useState<OpportunityStatus>(value)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const styles: Record<OpportunityStatus, string> = {
    'New': 'bg-blue-100 text-blue-800 ring-blue-600/20 focus:ring-blue-500',
    'Qualified': 'bg-purple-100 text-purple-800 ring-purple-600/20 focus:ring-purple-500',
    'Assessing': 'bg-amber-100 text-amber-800 ring-amber-600/20 focus:ring-amber-500',
    'Quoted': 'bg-orange-100 text-orange-800 ring-orange-600/20 focus:ring-orange-500',
    'Won': 'bg-green-100 text-green-800 ring-green-600/20 focus:ring-green-500',
    'Lost': 'bg-red-100 text-red-800 ring-red-600/20 focus:ring-red-500',
    'On Hold': 'bg-gray-100 text-gray-800 ring-gray-600/20 focus:ring-gray-500'
  }

  async function handleChange(newStatus: OpportunityStatus) {
    setSaving(true)
    setStatus(newStatus)
    try {
      const { error } = await supabase
        .from('opportunities')
        .update({ status: newStatus })
        .eq('id', id)
      if (error) throw error

      // Refresh the page to update the table sections
      router.refresh()
    } catch (e) {
      console.error('Failed to update status:', e)
      setStatus(value) // revert on error
    } finally {
      setSaving(false)
    }
  }

  const options: OpportunityStatus[] = ['New', 'Qualified', 'Assessing', 'Quoted', 'Won', 'Lost', 'On Hold']

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value as OpportunityStatus)}
      disabled={saving}
      className={`inline-flex items-center rounded-md px-1 py-1 text-xs font-medium ring-1 ring-inset border-none cursor-pointer hover:opacity-80 transition-opacity ${styles[status]} ${saving ? 'opacity-50' : ''}`}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  )
}
