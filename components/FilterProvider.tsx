"use client"
import { useState, useMemo, createContext, useContext } from 'react'
import type { Opportunity, OpportunityStatus } from '@/types/opportunity'
import type { FilterState } from '@/types/filters'
import { getDistinctValues } from '@/lib/filterHelpers'
import FilterControls from './FilterControls'

interface FilteredData {
  currentOpportunities: Opportunity[]
  closedOpportunities: Opportunity[]
}

const FilterContext = createContext<FilteredData | null>(null)

export function useFilteredOpportunities() {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('useFilteredOpportunities must be used within FilterProvider')
  }
  return context
}

interface FilterProviderProps {
  opportunities: Opportunity[]
  children: React.ReactNode
}

export default function FilterProvider({ opportunities, children }: FilterProviderProps) {
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    priority: [],
    bu: [],
    dss_dsp: []
  })

  // Extract distinct values for BU and DSS/DSP dropdowns
  const buOptions = useMemo(
    () => getDistinctValues(opportunities, 'bu'),
    [opportunities]
  )

  const dssOptions = useMemo(
    () => getDistinctValues(opportunities, 'dss_dsp_design'),
    [opportunities]
  )

  // Apply filters
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opp => {
      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(opp.status)) {
        return false
      }

      // Priority filter
      if (filters.priority.length > 0 && !filters.priority.includes(opp.priority)) {
        return false
      }

      // BU filter (handle null as "(Empty)")
      if (filters.bu.length > 0) {
        const buValue = opp.bu ?? '(Empty)'
        if (!filters.bu.includes(buValue)) {
          return false
        }
      }

      // DSS/DSP filter (handle null as "(Empty)")
      if (filters.dss_dsp.length > 0) {
        const dssValue = opp.dss_dsp_design ?? '(Empty)'
        if (!filters.dss_dsp.includes(dssValue)) {
          return false
        }
      }

      return true
    })
  }, [opportunities, filters])

  // Split into current and closed
  const closedStatuses: OpportunityStatus[] = ['Won', 'Lost', 'On Hold']
  const currentOpportunities = useMemo(
    () => filteredOpportunities.filter(o => !closedStatuses.includes(o.status)),
    [filteredOpportunities]
  )
  const closedOpportunities = useMemo(
    () => filteredOpportunities.filter(o => closedStatuses.includes(o.status)),
    [filteredOpportunities]
  )

  const contextValue = { currentOpportunities, closedOpportunities }

  return (
    <FilterContext.Provider value={contextValue}>
      <FilterControls
        filters={filters}
        onFilterChange={setFilters}
        buOptions={buOptions}
        dssOptions={dssOptions}
      />
      {children}
    </FilterContext.Provider>
  )
}
