"use client"
import { useState, useRef, useEffect } from 'react'

interface MultiSelectDropdownProps {
  label: string
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
  includeEmpty?: boolean
}

export default function MultiSelectDropdown({
  label,
  options,
  selected,
  onChange,
  includeEmpty = false
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const allOptions = includeEmpty ? ['(Empty)', ...options] : options

  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  const handleSelectAll = () => {
    onChange(allOptions)
  }

  const handleClear = () => {
    onChange([])
  }

  const selectedCount = selected.length
  const buttonText = selectedCount === 0
    ? label
    : selectedCount === 1
      ? `${label}: ${selected[0]}`
      : `${label} (${selectedCount})`

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full min-h-[32px] px-2 py-1.5 text-left text-xs border rounded-md bg-white hover:bg-gray-50 transition-colors ${
          selectedCount > 0
            ? 'border-blue-500 ring-1 ring-blue-500'
            : 'border-gray-200'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className={selectedCount > 0 ? 'font-medium text-gray-900' : 'text-gray-600'}>
            {buttonText}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto">
          <div className="sticky top-0 bg-gray-50 border-b border-gray-200 px-3 py-2 flex gap-2">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Select All
            </button>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-gray-600 hover:text-gray-800 font-medium"
            >
              Clear
            </button>
          </div>

          <div className="py-1">
            {allOptions.map((option) => (
              <label
                key={option}
                className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => handleToggle(option)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
