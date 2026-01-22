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
  bu: string | null
  air_flow_m3h: number | null
  number_of_units: number | null
  dss_dsp_design: string | null
  transfer_cost_without_oh_profit_8_per_u: number | null
  transfer_cost_complete_per_u: number | null
  vortice_price: number | null
  selling_price: number | null
  comments: string | null
  created_at: string
  updated_at: string
}

