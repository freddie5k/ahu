import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import * as XLSX from 'xlsx'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Read the file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Parse Excel file
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

    if (data.length < 2) {
      return NextResponse.json({ error: 'File is empty or has no data rows' }, { status: 400 })
    }

    // Get headers from first row
    const headers = data[0]
    const rows = data.slice(1) // Skip header row

    // Column mapping
    const columnMap: Record<string, number> = {}
    headers.forEach((header: string, index: number) => {
      const h = header?.toString().trim() || ''
      if (h === 'Project Name') columnMap.title = index
      if (h === 'BU') columnMap.bu = index
      if (h === 'Site') columnMap.site = index
      if (h === 'Owner') columnMap.owner_name = index
      if (h === 'Status') columnMap.status = index
      if (h === 'Priority') columnMap.priority = index
      if (h === 'Closing date') columnMap.target_close_date = index
      if (h === 'Description') columnMap.description = index
      if (h === 'Air flow (m3/h)') columnMap.air_flow_m3h = index
      if (h === 'Number of Units') columnMap.number_of_units = index
      if (h === 'DSS / DSP desing') columnMap.dss_dsp_design = index
      if (h.includes('Transfer cost without')) columnMap.transfer_cost_without_oh_profit_8_per_u = index
      if (h.includes('Transfer cost complete')) columnMap.transfer_cost_complete_per_u = index
      if (h.includes('Vortice price')) columnMap.vortice_price = index
      if (h.includes('Selling Price')) columnMap.selling_price = index
      if (h === 'Comments') columnMap.comments = index
    })

    let imported = 0
    let failed = 0
    const errors: string[] = []

    // Helper functions
    const parseCurrency = (value: any): number | null => {
      if (value === null || value === undefined || value === '') return null
      if (typeof value === 'number') return value
      const cleaned = String(value).replace(/[€,$]/g, '').replace(/,/g, '.').trim()
      const num = parseFloat(cleaned)
      return isNaN(num) ? null : num
    }

    const parseDate = (value: any): string | null => {
      if (!value) return null

      // Handle Excel date serial number
      if (typeof value === 'number') {
        const date = XLSX.SSF.parse_date_code(value)
        if (date) {
          return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`
        }
      }

      // Handle string dates
      if (typeof value === 'string') {
        const parts = value.split('/')
        if (parts.length === 3) {
          const [d, m, y] = parts
          return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
        }
      }

      return null
    }

    const getString = (value: any): string | null => {
      if (value === null || value === undefined || value === '') return null
      return String(value).trim()
    }

    const getInteger = (value: any): number | null => {
      if (value === null || value === undefined || value === '') return null
      const num = parseInt(String(value))
      return isNaN(num) ? null : num
    }

    // Process each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const rowNum = i + 2 // +2 because Excel is 1-indexed and we skipped header

      try {
        // Skip empty rows
        const title = getString(row[columnMap.title])
        if (!title) {
          continue
        }

        // Build opportunity object
        const opportunity: any = {
          title,
          bu: getString(row[columnMap.bu]),
          site: getString(row[columnMap.site]),
          owner_name: getString(row[columnMap.owner_name]),
          status: getString(row[columnMap.status]) || 'New',
          priority: getString(row[columnMap.priority]) || 'Medium',
          target_close_date: parseDate(row[columnMap.target_close_date]),
          description: getString(row[columnMap.description]),
          air_flow_m3h: parseCurrency(row[columnMap.air_flow_m3h]),
          number_of_units: getInteger(row[columnMap.number_of_units]),
          dss_dsp_design: getString(row[columnMap.dss_dsp_design]),
          transfer_cost_without_oh_profit_8_per_u: parseCurrency(row[columnMap.transfer_cost_without_oh_profit_8_per_u]),
          transfer_cost_complete_per_u: parseCurrency(row[columnMap.transfer_cost_complete_per_u]),
          vortice_price: parseCurrency(row[columnMap.vortice_price]),
          selling_price: parseCurrency(row[columnMap.selling_price]),
          comments: getString(row[columnMap.comments]),
        }

        // Set price_eur from selling_price
        opportunity.price_eur = opportunity.selling_price

        // Insert into database
        const { error } = await supabase
          .from('opportunities')
          .insert(opportunity)

        if (error) throw error

        imported++
      } catch (err: any) {
        failed++
        errors.push(`Row ${rowNum}: ${err.message}`)
      }
    }

    return NextResponse.json({
      success: imported,
      failed,
      errors,
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    )
  }
}
