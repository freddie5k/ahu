"use client"
import { useState } from 'react'
import Link from 'next/link'

export default function UploadDataPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<{ success: number; failed: number; errors: string[]; debug?: any } | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()

    if (!file) {
      setError('Please select a file')
      return
    }

    setUploading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-data', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setResult(data)
      setFile(null)

      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement
      if (fileInput) fileInput.value = ''

    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4">
        {/* Header */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Back to Opportunities
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
            Upload Excel Data
          </h1>
          <p className="mt-2 text-gray-600">Import opportunities from an Excel file</p>
        </div>

        {/* Upload Form */}
        <div className="rounded-xl bg-white shadow-lg ring-1 ring-gray-200/60 p-6">
          <form onSubmit={handleUpload} className="space-y-6">
            {/* File Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Excel File
              </label>
              <input
                id="file-input"
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                disabled={uploading}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="mt-2 text-xs text-gray-500">
                Upload an Excel file (.xlsx or .xls) with your opportunity data
              </p>
            </div>

            {/* Expected Format Info */}
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Expected Excel Format:</h3>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Column A: Project Name</li>
                <li>• Column B: BU</li>
                <li>• Column C: Site</li>
                <li>• Column D: Owner</li>
                <li>• Column E: Status</li>
                <li>• Column F: Priority</li>
                <li>• Column G: Closing date</li>
                <li>• Column H: Description</li>
                <li>• Column I: Air flow (m3/h)</li>
                <li>• Column J: Number of Units</li>
                <li>• Column K: DSS / DSP desing</li>
                <li>• Columns L-O: Cost fields</li>
                <li>• Column P: Comments</li>
              </ul>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {result && (
              <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                <h3 className="text-sm font-semibold text-green-900 mb-2">Upload Complete!</h3>
                <div className="text-sm text-green-800 space-y-1">
                  <p>✅ Successfully imported: {result.success} rows</p>
                  {result.failed > 0 && <p>❌ Failed: {result.failed} rows</p>}
                  {result.debug && (
                    <details className="mt-2">
                      <summary className="cursor-pointer font-medium">Debug Info</summary>
                      <div className="mt-2 text-xs bg-white p-2 rounded border border-green-200">
                        <p><strong>Total rows in Excel:</strong> {result.debug.totalRows}</p>
                        <p><strong>Headers found:</strong></p>
                        <pre className="text-[10px] overflow-auto">{JSON.stringify(result.debug.headers, null, 2)}</pre>
                        <p className="mt-2"><strong>Column mapping:</strong></p>
                        <pre className="text-[10px] overflow-auto">{JSON.stringify(result.debug.columnMap, null, 2)}</pre>
                      </div>
                    </details>
                  )}
                  {result.errors.length > 0 && (
                    <details className="mt-2">
                      <summary className="cursor-pointer font-medium">View errors</summary>
                      <ul className="mt-2 space-y-1 text-xs">
                        {result.errors.map((err, idx) => (
                          <li key={idx}>• {err}</li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={!file || uploading}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white text-sm font-medium px-5 py-3 hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    Upload & Import
                  </>
                )}
              </button>

              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-lg bg-gray-100 text-gray-700 text-sm font-medium px-5 py-3 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Instructions */}
        <div className="mt-6 rounded-lg bg-white border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">📝 Instructions:</h3>
          <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
            <li>Prepare your Excel file with the expected format above</li>
            <li>Click "Select Excel File" and choose your file</li>
            <li>Click "Upload & Import" to start the import process</li>
            <li>Wait for the upload to complete</li>
            <li>Check the results and go back to view your opportunities</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
