"use client"
import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

type BaseProps<T> = {
  id: string
  column: keyof T & string
  value: any
  className?: string
}

type TextProps<T> = BaseProps<T> & { kind: 'text' | 'number' | 'date' }
type SelectProps<T> = BaseProps<T> & { kind: 'select', options: string[] }

export default function EditableCell<T extends Record<string, any>>(props: TextProps<T> | SelectProps<T>) {
  const [val, setVal] = useState<any>(props.value ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const initial = useRef(true)

  useEffect(() => {
    // keep in sync if parent updates
    if (!saving) setVal(props.value ?? '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value])

  async function persist(next: any) {
    setSaving(true)
    setError(null)
    setVal(next)
    try {
      let v: any = next
      if (props.kind === 'number') {
        if (v === '' || v === null || v === undefined) v = null
        else {
          const n = Number(String(v).replace(/[^0-9.-]/g, ''))
          v = Number.isNaN(n) ? null : n
        }
      }
      const payload = { [props.column]: v }
      const { error } = await supabase.from('opportunities').update(payload).eq('id', props.id)
      if (error) throw error
    } catch (e: any) {
      setError(e?.message ?? 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (props.kind === 'select') {
    const p = props as SelectProps<T>
    return (
      <select
        value={val ?? ''}
        onChange={(e) => persist(e.target.value)}
        className={`select-condensed w-full ${props.className ?? ''}`}
      >
        {p.options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    )
  }

  return (
    <input
      type={props.kind === 'date' ? 'date' : 'text'}
      inputMode={props.kind === 'number' ? 'decimal' : undefined}
      value={val ?? ''}
      onChange={(e) => setVal(e.target.value)}
      onBlur={() => persist(val)}
      onKeyDown={(e) => { if (e.key === 'Enter') (e.currentTarget as HTMLInputElement).blur() }}
      className={`input-condensed w-full ${props.className ?? ''}`}
    />
  )
}

