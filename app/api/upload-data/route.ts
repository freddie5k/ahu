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

    console.log('Excel headers found:', headers)

    // Helper to normalize header names for matching
    const normalizeHeader = (h: any): string => {
      return h?.toString().trim().toLowerCase().replace(/\s+/g, ' ') || ''
    }

    // Column mapping - more flexible matching
    const columnMap: Record<string, number> = {}
    headers.forEach((header: any, index: number) => {
      const h = normalizeHeader(header)

      if (h.includes('project') && h.includes('name')) columnMap.title = index
      if (h === 'bu') columnMap.bu = index
      if (h === 'site') columnMap.site = index
      if (h === 'owner') columnMap.owner_name = index
      if (h === 'status') columnMap.status = index
      if (h === 'priority') columnMap.priority = index
      if (h.includes('closing') && h.includes('date')) columnMap.target_close_date = index
      if (h === 'description') columnMap.description = index
      if (h.includes('air') && h.includes('flow')) columnMap.air_flow_m3h = index
      if (h.includes('number') && h.includes('unit')) columnMap.number_of_units = index
      if (h.includes('dss') || h.includes('dsp')) columnMap.dss_dsp_design = index
      if (h.includes('transfer') && h.includes('without')) columnMap.transfer_cost_without_oh_profit_8_per_u = index
      if (h.includes('transfer') && h.includes('complete')) columnMap.transfer_cost_complete_per_u = index
      if (h.includes('vortice')) columnMap.vortice_price = index
      if (h.includes('selling')) columnMap.selling_price = index
      if (h === 'comments') columnMap.comments = index
    })

    console.log('Column mapping:', columnMap)
    console.log('First 3 data rows:', rows.slice(0, 3))

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
      if (value === null || value === undefined) return null
      const str = String(value).trim()
      if (str === '' || str === 'undefined' || str === 'null') return null
      return str
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
        // Skip completely empty rows
        if (!row || !Array.isArray(row) || row.length === 0) {
          console.log(`Row ${rowNum}: Skipping - row is null/undefined/empty array`)
          continue
        }

        // Check if row has any non-empty values
        const hasAnyValue = row.some((cell: any) => {
          return cell !== null && cell !== undefined && cell !== ''
        })

        if (!hasAnyValue) {
          console.log(`Row ${rowNum}: Skipping - completely empty`)
          continue
        }

        // Get title from Project Name column
        const title = getString(row[columnMap.title])

        console.log(`Row ${rowNum}: Project Name value:`, row[columnMap.title], '→ Processed:', title)

        if (!title) {
          console.log(`Row ${rowNum}: Skipping - no title in Project Name column`)
          continue
        }

        console.log(`Row ${rowNum}: ✓ Valid title found: "${title}"`)

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
        console.log(`Row ${rowNum}: ✅ Imported successfully`)
      } catch (err: any) {
        failed++
        const errorMsg = `Row ${rowNum}: ${err.message}`
        errors.push(errorMsg)
        console.error(errorMsg)
      }
    }

    console.log(`Import complete: ${imported} success, ${failed} failed`)

    return NextResponse.json({
      success: imported,
      failed,
      errors,
      debug: {
        totalRows: rows.length,
        columnMap,
        headers,
        firstRow: rows[0],
        secondRow: rows[1]
      }
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    )
  }
}
