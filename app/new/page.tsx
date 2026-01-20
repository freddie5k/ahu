import OpportunityForm from '@/components/OpportunityForm'

export default function NewOpportunityPage() {
  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">New Opportunity</h1>
      <OpportunityForm mode="create" />
    </div>
  )
}

