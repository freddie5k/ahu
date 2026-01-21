import type { OpportunityPriority } from '@/types/opportunity'

interface PriorityBadgeProps {
  priority: OpportunityPriority
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const styles: Record<OpportunityPriority, string> = {
    'Low': 'bg-gray-50 text-gray-700 ring-gray-600/20',
    'Medium': 'bg-yellow-50 text-yellow-800 ring-yellow-600/30',
    'High': 'bg-red-50 text-red-700 ring-red-600/20 font-semibold'
  }

  const icons: Record<OpportunityPriority, string> = {
    'Low': '↓',
    'Medium': '→',
    'High': '↑'
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs ring-1 ring-inset ${styles[priority]}`}>
      <span className="text-sm">{icons[priority]}</span>
      {priority}
    </span>
  )
}
