// Extract unique non-null values from array
export function getDistinctValues(items: any[], field: string): string[] {
  const values = new Set<string>()
  items.forEach(item => {
    const val = item[field]
    if (val !== null && val !== undefined && val !== '') {
      values.add(String(val))
    }
  })
  return Array.from(values).sort()
}

// Check if value matches filter (handles null as "(Empty)")
export function matchesFilter(value: any, filterValues: string[]): boolean {
  if (filterValues.length === 0) return true
  const normalized = value ?? '(Empty)'
  return filterValues.includes(String(normalized))
}
