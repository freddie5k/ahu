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

  const icons: Record<OpportunityPriority, JSX.Element> = {
    'Low': <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
    'Medium': <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    'High': <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs ring-1 ring-inset ${styles[priority]}`}>
      {icons[priority]}
      {priority}
    </span>
  )
}
