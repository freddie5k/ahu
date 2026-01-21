"use client"
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { OpportunityPriority } from '@/types/opportunity'

interface EditablePriorityCellProps {
  id: string
  value: OpportunityPriority
}

export default function EditablePriorityCell({ id, value }: EditablePriorityCellProps) {
  const [priority, setPriority] = useState<OpportunityPriority>(value)
  const [saving, setSaving] = useState(false)

  const styles: Record<OpportunityPriority, string> = {
    'Low': 'bg-gray-50 text-gray-700 ring-gray-600/20 focus:ring-gray-500',
    'Medium': 'bg-yellow-50 text-yellow-800 ring-yellow-600/30 focus:ring-yellow-500',
    'High': 'bg-red-50 text-red-700 ring-red-600/20 font-semibold focus:ring-red-500'
  }

  const icons: Record<OpportunityPriority, string> = {
    'Low': '↓',
    'Medium': '→',
    'High': '↑'
  }

  async function handleChange(newPriority: OpportunityPriority) {
    setSaving(true)
    setPriority(newPriority)
    try {
      const { error } = await supabase
        .from('opportunities')
        .update({ priority: newPriority })
        .eq('id', id)
      if (error) throw error
    } catch (e) {
      console.error('Failed to update priority:', e)
      setPriority(value) // revert on error
    } finally {
      setSaving(false)
    }
  }

  const options: OpportunityPriority[] = ['Low', 'Medium', 'High']

  return (
    <select
      value={priority}
      onChange={(e) => handleChange(e.target.value as OpportunityPriority)}
      disabled={saving}
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs ring-1 ring-inset border-none cursor-pointer hover:opacity-80 transition-opacity ${styles[priority]} ${saving ? 'opacity-50' : ''}`}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>{icons[opt]} {opt}</option>
      ))}
    </select>
  )
}
