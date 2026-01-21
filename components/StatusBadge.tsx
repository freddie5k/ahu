import type { OpportunityStatus } from '@/types/opportunity'

interface StatusBadgeProps {
  status: OpportunityStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<OpportunityStatus, string> = {
    'New': 'bg-blue-100 text-blue-800 ring-blue-600/20',
    'Qualified': 'bg-purple-100 text-purple-800 ring-purple-600/20',
    'Assessing': 'bg-amber-100 text-amber-800 ring-amber-600/20',
    'Quoted': 'bg-orange-100 text-orange-800 ring-orange-600/20',
    'Won': 'bg-green-100 text-green-800 ring-green-600/20',
    'Lost': 'bg-red-100 text-red-800 ring-red-600/20',
    'On Hold': 'bg-gray-100 text-gray-800 ring-gray-600/20'
  }

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${styles[status]}`}>
      {status}
    </span>
  )
}
