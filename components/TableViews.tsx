"use client"
import { useFilteredOpportunities } from './FilterProvider'
import EditableCell from './EditableCell'
import EditableStatusCell from './EditableStatusCell'
import EditablePriorityCell from './EditablePriorityCell'
import OpportunityActions from './OpportunityActions'
import ResizableTable from './ResizableTable'
import Link from 'next/link'
import { ArrowDownIcon, ArrowUpIcon } from './icons'

interface TableViewsProps {
  column: string
  ascending: boolean
  sortable: Record<string, string>
}

export default function TableViews({ column, ascending, sortable }: TableViewsProps) {
  const { currentOpportunities, closedOpportunities } = useFilteredOpportunities()

  // Calculate total value of Won orders (sum of transfer_cost_complete_per_u)
  const wonOrdersTotal = closedOpportunities
    .filter(o => o.status === 'Won')
    .reduce((sum, o) => sum + (o.transfer_cost_complete_per_u || 0), 0)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value)
  }

  function sortLink(key: keyof typeof sortable, label: string) {
    const active = column === sortable[key]
    const nextDir = !active ? 'asc' : (ascending ? 'desc' : 'asc')
    const href = `/?sort=${key}&dir=${nextDir}`
    return (
      <Link href={href} className={`inline-flex items-center gap-1 ${active ? 'text-gray-900' : 'text-gray-600'} hover:underline`}>
        {label}
        {active ? (ascending ? <ArrowUpIcon width={14} height={14}/> : <ArrowDownIcon width={14} height={14}/>) : null}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile Card View */}
      <div className="md:hidden space-y-6">
        {/* Current Projects Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 px-2">Current</h2>
          {currentOpportunities.length === 0 ? (
            <div className="rounded-xl bg-white shadow-lg ring-1 ring-gray-200/50 p-8 text-center">
              <p className="text-gray-500 text-sm">No current opportunities</p>
            </div>
          ) : (
            currentOpportunities.map((o) => (
              <div key={o.id} className="rounded-xl bg-white shadow-lg ring-1 ring-gray-200/60 p-4 space-y-3 hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="px-2.5 py-1.5 mb-2">
                      <EditableCell<any>
                        id={o.id}
                        column="title"
                        value={o.title}
                        kind="text"
                        className="font-semibold text-gray-900 bg-transparent border-transparent focus:ring-blue-500 focus:border-blue-500 text-base"
                      />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <EditableStatusCell id={o.id} value={o.status} />
                      <EditablePriorityCell id={o.id} value={o.priority} />
                    </div>
                  </div>
                  <OpportunityActions id={o.id} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">BU</div>
                    <EditableCell<any> id={o.id} column="bu" value={o.bu} kind="text" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Owner</div>
                    <EditableCell<any> id={o.id} column="owner_name" value={o.owner_name} kind="text" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Closing Date</div>
                    <EditableCell<any> id={o.id} column="target_close_date" value={o.target_close_date} kind="date" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Units</div>
                    <EditableCell<any> id={o.id} column="number_of_units" value={o.number_of_units} kind="number" className="numeric" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Air Flow (m³/h)</div>
                    <EditableCell<any> id={o.id} column="air_flow_m3h" value={o.air_flow_m3h} kind="number" className="numeric" />
                  </div>
                </div>
                <div className="text-sm">
                  <div className="text-xs text-gray-500 mb-1">Price</div>
                  <EditableCell<any> id={o.id} column="price_eur" value={o.price_eur} kind="number" className="numeric price-cell" placeholder="€" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Won Orders Summary */}
        <div className="mx-2 mt-8 px-4 py-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-green-800">Value of Won Orders:</span>
            <span className="text-lg font-bold text-green-700">{formatCurrency(wonOrdersTotal)}</span>
          </div>
        </div>

        {/* Closed Projects Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 px-2">Closed</h2>
          {closedOpportunities.length === 0 ? (
            <div className="rounded-xl bg-white shadow-lg ring-1 ring-gray-200/50 p-8 text-center">
              <p className="text-gray-500 text-sm">No closed opportunities</p>
            </div>
          ) : (
            closedOpportunities.map((o) => (
              <div key={o.id} className="rounded-xl bg-white shadow-lg ring-1 ring-gray-200/60 p-4 space-y-3 hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="px-2.5 py-1.5 mb-2">
                      <EditableCell<any>
                        id={o.id}
                        column="title"
                        value={o.title}
                        kind="text"
                        className="font-semibold text-gray-900 bg-transparent border-transparent focus:ring-blue-500 focus:border-blue-500 text-base"
                      />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <EditableStatusCell id={o.id} value={o.status} />
                      <EditablePriorityCell id={o.id} value={o.priority} />
                    </div>
                  </div>
                  <OpportunityActions id={o.id} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">BU</div>
                    <EditableCell<any> id={o.id} column="bu" value={o.bu} kind="text" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Owner</div>
                    <EditableCell<any> id={o.id} column="owner_name" value={o.owner_name} kind="text" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Closing Date</div>
                    <EditableCell<any> id={o.id} column="target_close_date" value={o.target_close_date} kind="date" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Units</div>
                    <EditableCell<any> id={o.id} column="number_of_units" value={o.number_of_units} kind="number" className="numeric" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Air Flow (m³/h)</div>
                    <EditableCell<any> id={o.id} column="air_flow_m3h" value={o.air_flow_m3h} kind="number" className="numeric" />
                  </div>
                </div>
                <div className="text-sm">
                  <div className="text-xs text-gray-500 mb-1">Price</div>
                  <EditableCell<any> id={o.id} column="price_eur" value={o.price_eur} kind="number" className="numeric price-cell" placeholder="€" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block space-y-6">
        {/* Current Projects Section */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">Current</h2>
          <div className="rounded-xl bg-white shadow-lg ring-1 ring-gray-200/60 overflow-hidden">
            <div className="overflow-x-auto">
              <ResizableTable>
                <thead className="bg-gradient-to-b from-gray-50 to-gray-100/50 border-b border-gray-200">
                  <tr className="text-left text-gray-700 text-xs">
                    <th className="px-3 py-2.5 font-semibold sticky left-0 bg-gray-50 z-10" style={{width: '280px'}}>{sortLink('title','Project Name')}</th>
                    <th className="px-2 py-2.5 font-semibold" style={{width: '60px'}}>BU</th>
                    <th className="px-2 py-2.5 font-semibold" style={{width: '120px'}}>Owner</th>
                    <th className="px-2 py-2.5 font-semibold" style={{width: '100px'}}>Status</th>
                    <th className="px-2 py-2.5 font-semibold" style={{width: '90px'}}>Priority</th>
                    <th className="px-2 py-2.5 font-semibold" style={{width: '90px'}}>Closing Date</th>
                    <th className="px-2 py-2.5 font-semibold" style={{width: '110px'}}>Air Flow (m³/h)</th>
                    <th className="px-2 py-2.5 font-semibold" style={{width: '60px'}}>Units</th>
                    <th className="px-2 py-2.5 font-semibold" style={{width: '70px'}}>DSS/DSP</th>
                    <th className="px-2 py-2.5 font-semibold" style={{width: '110px'}}>Transfer Cost (OH)</th>
                    <th className="px-2 py-2.5 font-semibold" style={{width: '120px'}}>Transfer Cost Complete</th>
                    <th className="px-2 py-2.5 font-semibold" style={{width: '100px'}}>Vortice Price</th>
                    <th className="px-2 py-2.5 font-semibold" style={{width: '120px'}}>Selling Price</th>
                    <th className="px-2 py-2.5 font-semibold" style={{width: '250px'}}>Comments / Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOpportunities.length === 0 ? (
                    <tr>
                      <td colSpan={14} className="px-4 py-8 text-center">
                        <p className="text-gray-500 font-medium">No current opportunities</p>
                      </td>
                    </tr>
                  ) : (
                    currentOpportunities.map((o) => (
                      <tr key={o.id} className="group hover:bg-gradient-to-r hover:from-blue-50/40 hover:to-blue-50/20 transition-all duration-200 border-b border-gray-100 last:border-b-0 text-xs">
                        <td className="px-3 py-2 sticky left-0 bg-white group-hover:bg-blue-50/40 z-10">
                          <EditableCell<any>
                            id={o.id}
                            column="title"
                            value={o.title}
                            kind="text"
                            className="font-semibold text-gray-900 bg-transparent border-transparent focus:ring-blue-500 focus:border-blue-500 text-xs"
                          />
                        </td>
                        <td className="px-2 py-2"><EditableCell<any> id={o.id} column="bu" value={o.bu} kind="text" className="text-xs" /></td>
                        <td className="px-2 py-2"><EditableCell<any> id={o.id} column="owner_name" value={o.owner_name} kind="text" className="text-xs" /></td>
                        <td className="px-2 py-2"><EditableStatusCell id={o.id} value={o.status} /></td>
                        <td className="px-2 py-2"><EditablePriorityCell id={o.id} value={o.priority} /></td>
                        <td className="px-2 py-2"><EditableCell<any> id={o.id} column="target_close_date" value={o.target_close_date} kind="date" className="text-xs" /></td>
                        <td className="px-2 py-2"><EditableCell<any> id={o.id} column="air_flow_m3h" value={o.air_flow_m3h} kind="number" className="numeric text-xs" /></td>
                        <td className="px-2 py-2"><EditableCell<any> id={o.id} column="number_of_units" value={o.number_of_units} kind="number" className="numeric text-xs" /></td>
                        <td className="px-2 py-2"><EditableCell<any> id={o.id} column="dss_dsp_design" value={o.dss_dsp_design} kind="text" className="text-xs" /></td>
                        <td className="px-2 py-2"><EditableCell<any> id={o.id} column="transfer_cost_without_oh_profit_8_per_u" value={o.transfer_cost_without_oh_profit_8_per_u} kind="number" className="numeric text-xs" placeholder="€" /></td>
                        <td className="px-2 py-2"><EditableCell<any> id={o.id} column="transfer_cost_complete_per_u" value={o.transfer_cost_complete_per_u} kind="number" className="numeric text-xs" placeholder="€" /></td>
                        <td className="px-2 py-2"><EditableCell<any> id={o.id} column="vortice_price" value={o.vortice_price} kind="number" className="numeric text-xs" placeholder="€" /></td>
                        <td className="px-2 py-2"><EditableCell<any> id={o.id} column="selling_price" value={o.selling_price} kind="number" className="numeric price-cell text-xs" placeholder="€" /></td>
                        <td className="px-2 py-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <EditableCell<any> id={o.id} column="comments" value={o.comments} kind="text" className="text-xs" />
                            </div>
                            <OpportunityActions id={o.id} />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </ResizableTable>
            </div>
          </div>
        </div>

        {/* Won Orders Summary */}
        <div className="mt-8 px-4 py-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-green-800">Value of Won Orders:</span>
            <span className="text-lg font-bold text-green-700">{formatCurrency(wonOrdersTotal)}</span>
          </div>
        </div>

        {/* Closed Projects Section */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">Closed</h2>
          <div className="rounded-xl bg-white shadow-lg ring-1 ring-gray-200/60 overflow-hidden">
            <div className="overflow-x-auto">
              <ResizableTable>
                <thead className="bg-gradient-to-b from-gray-50 to-gray-100/50 border-b border-gray-200">
                  <tr className="text-left text-gray-700 text-xs">
                    <th className="px-3 py-2.5 font-semibold sticky left-0 bg-gray-50 z-10" style={{width: '280px'}}>{sortLink('title','Project Name')}</th>
                    <th className="px-2 py-2.5 font-semibold" style={{width: '60px'}}>BU</th>
                    <th className="px-2 py-2.5 font-semibold" style={{width: '120px'}}>Owner</th>
                    <th className="px-2 py-2.5 font-semibold" style={{width: '100px'}}>Status</th>
                    <th className="px-2 py-2.5 font-semibold" style={{width: '90px'}}>Priority</th>
                    <th className="px-2 py-2.5 font-semibold" style={{width: '90px'}}>Closing Date</th>
                    <th className="px-2 py-2.5 font-semibold" style={{width: '110px'}}>Air Flow (m³/h)</th>
                    <th className="px-2 py-2.5 font-semibold" style={{width: '60px'}}>Units</th>
                    <th className="px-2 py-2.5 font-semibold" style={{width: '70px'}}>DSS/DSP</th>
                    <th className="px-2 py-2.5 font-semibold" style={{width: '110px'}}>Transfer Cost (OH)</th>
                    <th className="px-2 py-2.5 font-semibold" style={{width: '120px'}}>Transfer Cost Complete</th>
                    <th className="px-2 py-2.5 font-semibold" style={{width: '100px'}}>Vortice Price</th>
                    <th className="px-2 py-2.5 font-semibold" style={{width: '120px'}}>Selling Price</th>
                    <th className="px-2 py-2.5 font-semibold" style={{width: '250px'}}>Comments / Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {closedOpportunities.length === 0 ? (
                    <tr>
                      <td colSpan={14} className="px-4 py-8 text-center">
                        <p className="text-gray-500 font-medium">No closed opportunities</p>
                      </td>
                    </tr>
                  ) : (
                    closedOpportunities.map((o) => (
                      <tr key={o.id} className="group hover:bg-gradient-to-r hover:from-blue-50/40 hover:to-blue-50/20 transition-all duration-200 border-b border-gray-100 last:border-b-0 text-xs">
                        <td className="px-3 py-2 sticky left-0 bg-white group-hover:bg-blue-50/40 z-10">
                          <EditableCell<any>
                            id={o.id}
                            column="title"
                            value={o.title}
                            kind="text"
                            className="font-semibold text-gray-900 bg-transparent border-transparent focus:ring-blue-500 focus:border-blue-500 text-xs"
                          />
                        </td>
                        <td className="px-2 py-2"><EditableCell<any> id={o.id} column="bu" value={o.bu} kind="text" className="text-xs" /></td>
                        <td className="px-2 py-2"><EditableCell<any> id={o.id} column="owner_name" value={o.owner_name} kind="text" className="text-xs" /></td>
                        <td className="px-2 py-2"><EditableStatusCell id={o.id} value={o.status} /></td>
                        <td className="px-2 py-2"><EditablePriorityCell id={o.id} value={o.priority} /></td>
                        <td className="px-2 py-2"><EditableCell<any> id={o.id} column="target_close_date" value={o.target_close_date} kind="date" className="text-xs" /></td>
                        <td className="px-2 py-2"><EditableCell<any> id={o.id} column="air_flow_m3h" value={o.air_flow_m3h} kind="number" className="numeric text-xs" /></td>
                        <td className="px-2 py-2"><EditableCell<any> id={o.id} column="number_of_units" value={o.number_of_units} kind="number" className="numeric text-xs" /></td>
                        <td className="px-2 py-2"><EditableCell<any> id={o.id} column="dss_dsp_design" value={o.dss_dsp_design} kind="text" className="text-xs" /></td>
                        <td className="px-2 py-2"><EditableCell<any> id={o.id} column="transfer_cost_without_oh_profit_8_per_u" value={o.transfer_cost_without_oh_profit_8_per_u} kind="number" className="numeric text-xs" placeholder="€" /></td>
                        <td className="px-2 py-2"><EditableCell<any> id={o.id} column="transfer_cost_complete_per_u" value={o.transfer_cost_complete_per_u} kind="number" className="numeric text-xs" placeholder="€" /></td>
                        <td className="px-2 py-2"><EditableCell<any> id={o.id} column="vortice_price" value={o.vortice_price} kind="number" className="numeric text-xs" placeholder="€" /></td>
                        <td className="px-2 py-2"><EditableCell<any> id={o.id} column="selling_price" value={o.selling_price} kind="number" className="numeric price-cell text-xs" placeholder="€" /></td>
                        <td className="px-2 py-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <EditableCell<any> id={o.id} column="comments" value={o.comments} kind="text" className="text-xs" />
                            </div>
                            <OpportunityActions id={o.id} />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </ResizableTable>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
