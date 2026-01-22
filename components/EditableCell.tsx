"use client"
import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

type BaseProps<T> = {
  id: string
  column: keyof T & string
  value: any
  className?: string
  placeholder?: string
}

type TextProps<T> = BaseProps<T> & { kind: 'text' | 'number' | 'date' }
type SelectProps<T> = BaseProps<T> & { kind: 'select', options: string[] }

export default function EditableCell<T extends Record<string, any>>(props: TextProps<T> | SelectProps<T>) {
  const [focused, setFocused] = useState(false)
  const [val, setVal] = useState<any>(() => initialValue(props))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const initial = useRef(true)

  useEffect(() => {
    // keep in sync if parent updates
    if (!saving && !focused) setVal(initialValue(props))
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
      if (props.kind === 'number') {
        // Only format as currency if placeholder is "€"
        setVal(v === null ? '' : (props.placeholder === '€' ? formatEUR(v) : v.toLocaleString()))
      }
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
      onFocus={() => setFocused(true)}
      onBlur={() => { setFocused(false); persist(val) }}
      onKeyDown={(e) => { if (e.key === 'Enter') (e.currentTarget as HTMLInputElement).blur() }}
      placeholder={props.placeholder}
      className={`input-condensed w-full ${props.className ?? ''}`}
    />
  )
}

function initialValue<T extends Record<string, any>>(props: TextProps<T> | SelectProps<T>) {
  if (props.kind === 'number') {
    if (props.value === null || props.value === undefined || props.value === '') return ''
    const n = Number(props.value)
    // Only format as currency if placeholder is "€"
    return Number.isNaN(n) ? '' : (props.placeholder === '€' ? formatEUR(n) : n.toLocaleString())
  }
  return props.value ?? ''
}

function formatEUR(n: number) {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
  } catch {
    return `€${n.toLocaleString()}`
  }
}
