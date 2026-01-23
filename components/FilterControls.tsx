"use client"
import MultiSelectDropdown from './MultiSelectDropdown'
import type { FilterState } from '@/types/filters'
import type { OpportunityStatus, OpportunityPriority } from '@/types/opportunity'

const STATUS_OPTIONS: OpportunityStatus[] = ['New', 'Qualified', 'Assessing', 'Quoted', 'Won', 'Lost', 'On Hold']
const PRIORITY_OPTIONS: OpportunityPriority[] = ['Low', 'Medium', 'High']

interface FilterControlsProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  buOptions: string[]
  dssOptions: string[]
}

export default function FilterControls({
  filters,
  onFilterChange,
  buOptions,
  dssOptions
}: FilterControlsProps) {
  const handleClearAll = () => {
    onFilterChange({
      status: [],
      priority: [],
      bu: [],
      dss_dsp: []
    })
  }

  const activeFilterCount =
    filters.status.length +
    filters.priority.length +
    filters.bu.length +
    filters.dss_dsp.length

  const hasActiveFilters = activeFilterCount > 0

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-2 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-gray-700">Filters</h3>
          {hasActiveFilters && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {activeFilterCount}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleClearAll}
          disabled={!hasActiveFilters}
          className="text-xs text-gray-600 hover:text-gray-900 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          Clear All Filters
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <MultiSelectDropdown
          label="Status"
          options={STATUS_OPTIONS}
          selected={filters.status}
          onChange={(selected) => onFilterChange({ ...filters, status: selected })}
        />

        <MultiSelectDropdown
          label="Priority"
          options={PRIORITY_OPTIONS}
          selected={filters.priority}
          onChange={(selected) => onFilterChange({ ...filters, priority: selected })}
        />

        <MultiSelectDropdown
          label="BU"
          options={buOptions}
          selected={filters.bu}
          onChange={(selected) => onFilterChange({ ...filters, bu: selected })}
          includeEmpty={true}
        />

        <MultiSelectDropdown
          label="DSS/DSP"
          options={dssOptions}
          selected={filters.dss_dsp}
          onChange={(selected) => onFilterChange({ ...filters, dss_dsp: selected })}
          includeEmpty={true}
        />
      </div>
    </div>
  )
}
