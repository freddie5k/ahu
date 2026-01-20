"use client"
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Opportunity, OpportunityPriority, OpportunityStatus } from '@/types/opportunity'
import OpportunityActions from '@/components/OpportunityActions'

const statuses: OpportunityStatus[] = ['New','Qualified','Assessing','Quoted','Won','Lost','On Hold']
const priorities: OpportunityPriority[] = ['Low','Medium','High']

export default function OpportunityCard({ opp }: { opp: Opportunity }) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [state, setState] = useState({
    title: opp.title,
    site: opp.site,
    description: opp.description ?? '',
    status: opp.status as OpportunityStatus,
    priority: opp.priority as OpportunityPriority,
    target_close_date: opp.target_close_date ?? '',
    owner_name: opp.owner_name ?? '',
    estimated_savings_usd: opp.estimated_savings_usd === null ? '' : String(opp.estimated_savings_usd),
    estimated_cost_usd: opp.estimated_cost_usd === null ? '' : String(opp.estimated_cost_usd),
  })

  async function persist(patch: Partial<typeof state>) {
    setSaving(true)
    setError(null)
    setState(prev => ({ ...prev, ...patch }))
    try {
      const payload = {
        title: patch.title ?? state.title,
        site: patch.site ?? state.site,
        description: (patch.description ?? state.description) || null,
        status: (patch.status ?? state.status),
        priority: (patch.priority ?? state.priority),
        target_close_date: (patch.target_close_date ?? state.target_close_date) || null,
        owner_name: (patch.owner_name ?? state.owner_name) || null,
        estimated_savings_usd: normalizeNumber(patch.estimated_savings_usd ?? state.estimated_savings_usd),
        estimated_cost_usd: normalizeNumber(patch.estimated_cost_usd ?? state.estimated_cost_usd),
      }
      const { error } = await supabase.from('opportunities').update(payload).eq('id', opp.id)
      if (error) throw error
    } catch (e: any) {
      setError(e?.message ?? 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  function normalizeNumber(val: string | number | null | undefined) {
    if (val === '' || val === null || val === undefined) return null
    const num = typeof val === 'string' ? Number(val.replace(/[^0-9.-]/g,'')) : Number(val)
    if (Number.isNaN(num)) return null
    return num
  }

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <input
          value={state.title}
          onChange={(e) => setState(s => ({...s, title: e.target.value}))}
          onBlur={() => persist({ title: state.title })}
          className="text-base font-medium outline-none w-full"
        />
        <OpportunityActions id={opp.id} />
      </div>

      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        <Field label="Site">
          <input className="input w-full" value={state.site} onChange={(e)=>setState(s=>({...s, site: e.target.value}))} onBlur={()=>persist({site: state.site})} />
        </Field>
        <Field label="Status">
          <select className="input w-full" value={state.status} onChange={(e)=>persist({status: e.target.value as OpportunityStatus})}>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Priority">
          <select className="input w-full" value={state.priority} onChange={(e)=>persist({priority: e.target.value as OpportunityPriority})}>
            {priorities.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </Field>
        <Field label="Closing Date">
          <input type="date" className="input w-full" value={state.target_close_date ?? ''} onChange={(e)=>persist({target_close_date: e.target.value})} />
        </Field>
        <Field label="Owner">
          <input className="input w-full" value={state.owner_name} onChange={(e)=>setState(s=>({...s, owner_name: e.target.value}))} onBlur={()=>persist({owner_name: state.owner_name})} />
        </Field>
        <Field label="Savings (USD)">
          <input inputMode="decimal" className="input w-full" value={state.estimated_savings_usd} onChange={(e)=>setState(s=>({...s, estimated_savings_usd: e.target.value}))} onBlur={()=>persist({estimated_savings_usd: state.estimated_savings_usd})} />
        </Field>
        <Field label="Cost (USD)">
          <input inputMode="decimal" className="input w-full" value={state.estimated_cost_usd} onChange={(e)=>setState(s=>({...s, estimated_cost_usd: e.target.value}))} onBlur={()=>persist({estimated_cost_usd: state.estimated_cost_usd})} />
        </Field>
      </div>

      <div className="mt-3">
        <Field label="Description">
          <textarea className="input w-full min-h-20" value={state.description} onChange={(e)=>setState(s=>({...s, description: e.target.value}))} onBlur={()=>persist({description: state.description})} />
        </Field>
      </div>

      <div className="mt-2 text-xs text-gray-500">
        {saving ? 'Saving…' : error ? <span className="text-red-600">{error}</span> : null}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-gray-600">{label}</span>
      {children}
    </label>
  )
}

