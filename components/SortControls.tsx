"use client"
import { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ArrowDownIcon, ArrowUpIcon } from '@/components/icons'

const options = [
  { key: 'updated_at', label: 'Last Updated' },
  { key: 'title', label: 'Project Name' },
  { key: 'site', label: 'Site' },
  { key: 'status', label: 'Status' },
  { key: 'priority', label: 'Priority' },
  { key: 'target_close_date', label: 'Closing Date' },
  { key: 'owner_name', label: 'Owner' },
  { key: 'price_eur', label: 'Price (€)' },
]

export default function SortControls() {
  const search = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const sort = search.get('sort') ?? 'updated_at'
  const dir = search.get('dir') ?? 'desc'

  const set = (k: string, v: string) => {
    const sp = new URLSearchParams(search.toString())
    sp.set(k, v)
    router.push(`${pathname}?${sp.toString()}`)
  }

  const label = useMemo(() => options.find(o => o.key === sort)?.label ?? 'Last Updated', [sort])

  return (
    <div className="flex items-center gap-2 sm:gap-3 text-sm">
      <div className="hidden sm:block text-gray-600">Sort by</div>
      <select
        value={sort}
        onChange={(e) => set('sort', e.target.value)}
        className="input h-9 text-xs sm:text-sm"
      >
        {options.map(o => (
          <option key={o.key} value={o.key}>{o.label}</option>
        ))}
      </select>
      <div className="flex rounded-md ring-1 ring-gray-200 overflow-hidden">
        <button
          onClick={() => set('dir','asc')}
          className={`px-2 py-1.5 ${dir==='asc' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
          aria-label="Ascending"
          title="Ascending"
        >
          <ArrowUpIcon width={14} height={14} />
        </button>
        <button
          onClick={() => set('dir','desc')}
          className={`px-2 py-1.5 border-l border-gray-200 ${dir==='desc' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
          aria-label="Descending"
          title="Descending"
        >
          <ArrowDownIcon width={14} height={14} />
        </button>
      </div>
    </div>
  )
}

