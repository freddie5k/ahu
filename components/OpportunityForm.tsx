"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Opportunity, OpportunityPriority, OpportunityStatus } from '@/types/opportunity'

type Props = {
  initial?: Partial<Opportunity>
  mode: 'create' | 'edit'
}

const statuses: OpportunityStatus[] = ['New', 'Qualified', 'Assessing', 'Quoted', 'Won', 'Lost', 'On Hold']
const priorities: OpportunityPriority[] = ['Low', 'Medium', 'High']

export default function OpportunityForm({ initial, mode }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState(initial?.title ?? '')
  const [site, setSite] = useState(initial?.site ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [status, setStatus] = useState<OpportunityStatus>((initial?.status as OpportunityStatus) ?? 'New')
  const [priority, setPriority] = useState<OpportunityPriority>((initial?.priority as OpportunityPriority) ?? 'Medium')
  const [targetCloseDate, setTargetCloseDate] = useState(initial?.target_close_date ?? '')
  const [ownerName, setOwnerName] = useState(initial?.owner_name ?? '')
  const [estimatedSavings, setEstimatedSavings] = useState<string>(
    initial?.estimated_savings_usd !== undefined && initial?.estimated_savings_usd !== null
      ? String(initial.estimated_savings_usd)
      : ''
  )
  const [estimatedCost, setEstimatedCost] = useState<string>(
    initial?.estimated_cost_usd !== undefined && initial?.estimated_cost_usd !== null ? String(initial.estimated_cost_usd) : ''
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const payload = {
        title,
        site,
        description: description || null,
        status,
        priority,
        target_close_date: targetCloseDate || null,
        owner_name: ownerName || null,
        estimated_savings_usd: estimatedSavings === '' ? null : Number(estimatedSavings),
        estimated_cost_usd: estimatedCost === '' ? null : Number(estimatedCost),
      }

      if (mode === 'create') {
        const { data, error } = await supabase.from('opportunities').insert(payload).select('id').single()
        if (error) throw error
        if (data?.id) router.push(`/opportunity/${data.id}`)
        else router.push('/')
      } else if (mode === 'edit' && initial?.id) {
        const { error } = await supabase.from('opportunities').update(payload).eq('id', initial.id)
        if (error) throw error
        router.refresh()
      }
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="rounded bg-red-50 text-red-700 p-3 text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Title</span>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Site</span>
          <input required value={site} onChange={(e) => setSite(e.target.value)} className="input" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as OpportunityStatus)} className="input">
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Priority</span>
          <select value={priority} onChange={(e) => setPriority(e.target.value as OpportunityPriority)} className="input">
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Target Close Date</span>
          <input type="date" value={targetCloseDate ?? ''} onChange={(e) => setTargetCloseDate(e.target.value)} className="input" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Owner</span>
          <input value={ownerName ?? ''} onChange={(e) => setOwnerName(e.target.value)} className="input" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Estimated Savings (EUR)</span>
          <input inputMode="decimal" placeholder="€" value={estimatedSavings} onChange={(e) => setEstimatedSavings(e.target.value)} className="input" />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Estimated Cost (EUR)</span>
          <input inputMode="decimal" placeholder="€" value={estimatedCost} onChange={(e) => setEstimatedCost(e.target.value)} className="input" />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-gray-700">Description</span>
        <textarea value={description ?? ''} onChange={(e) => setDescription(e.target.value)} className="input min-h-24" />
      </label>

      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving…' : mode === 'create' ? 'Create' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}
