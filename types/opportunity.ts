export type OpportunityStatus = 'New' | 'Qualified' | 'Assessing' | 'Quoted' | 'Won' | 'Lost' | 'On Hold'
export type OpportunityPriority = 'Low' | 'Medium' | 'High'

export type Opportunity = {
  id: string
  title: string
  site: string
  description: string | null
  status: OpportunityStatus
  priority: OpportunityPriority
  target_close_date: string | null
  owner_name: string | null
  price_eur: number | null
  created_at: string
  updated_at: string
}

