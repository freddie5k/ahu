import OpportunityForm from '@/components/OpportunityForm'

export default function NewOpportunityPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-semibold">New Opportunity</h1>
      <OpportunityForm mode="create" />
    </div>
  )
}

