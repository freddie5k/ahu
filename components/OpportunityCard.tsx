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

  const gridClass = "grid items-center gap-3 [grid-template-columns:2fr_1.2fr_1fr_1fr_1fr_1.2fr_1fr_1fr_auto]"

  return (
    <div className="card p-3">
      <div className={gridClass}>
        <input
          value={state.title}
          onChange={(e) => setState(s => ({...s, title: e.target.value}))}
          onBlur={() => persist({ title: state.title })}
          className="input-condensed font-medium truncate"
          placeholder="Project Name"
        />

        <input className="input-condensed truncate" placeholder="Site" value={state.site} onChange={(e)=>setState(s=>({...s, site: e.target.value}))} onBlur={()=>persist({site: state.site})} />

        <select className="select-condensed" value={state.status} onChange={(e)=>persist({status: e.target.value as OpportunityStatus})}>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select className="select-condensed" value={state.priority} onChange={(e)=>persist({priority: e.target.value as OpportunityPriority})}>
          {priorities.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <input type="date" className="input-condensed" value={state.target_close_date ?? ''} onChange={(e)=>persist({target_close_date: e.target.value})} />

        <input className="input-condensed truncate" placeholder="Owner" value={state.owner_name} onChange={(e)=>setState(s=>({...s, owner_name: e.target.value}))} onBlur={()=>persist({owner_name: state.owner_name})} />

        <input inputMode="decimal" className="input-condensed" placeholder="Savings" value={state.estimated_savings_usd} onChange={(e)=>setState(s=>({...s, estimated_savings_usd: e.target.value}))} onBlur={()=>persist({estimated_savings_usd: state.estimated_savings_usd})} />

        <input inputMode="decimal" className="input-condensed" placeholder="Cost" value={state.estimated_cost_usd} onChange={(e)=>setState(s=>({...s, estimated_cost_usd: e.target.value}))} onBlur={()=>persist({estimated_cost_usd: state.estimated_cost_usd})} />

        <div className="justify-self-end"><OpportunityActions id={opp.id} /></div>
      </div>

      <div className="mt-2">
        <textarea className="input-condensed w-full" placeholder="Description" value={state.description} onChange={(e)=>setState(s=>({...s, description: e.target.value}))} onBlur={()=>persist({description: state.description})} />
      </div>

      <div className="mt-1 text-[11px] text-gray-500">
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
