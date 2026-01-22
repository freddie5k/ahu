"use client"
import { useState, useRef, useEffect } from 'react'

interface ResizableTableProps {
  children: React.ReactNode
}

export default function ResizableTable({ children }: ResizableTableProps) {
  const tableRef = useRef<HTMLTableElement>(null)
  const [resizing, setResizing] = useState<number | null>(null)
  const [startX, setStartX] = useState(0)
  const [startWidth, setStartWidth] = useState(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (resizing === null || !tableRef.current) return

      const diff = e.clientX - startX
      const newWidth = Math.max(50, startWidth + diff)

      const th = tableRef.current.querySelectorAll('th')[resizing]
      const cells = tableRef.current.querySelectorAll(`tbody tr td:nth-child(${resizing + 1})`)

      if (th) {
        th.style.width = `${newWidth}px`
        th.style.minWidth = `${newWidth}px`
        th.style.maxWidth = `${newWidth}px`
      }

      cells.forEach((cell) => {
        const tdElement = cell as HTMLElement
        tdElement.style.width = `${newWidth}px`
        tdElement.style.minWidth = `${newWidth}px`
        tdElement.style.maxWidth = `${newWidth}px`
      })
    }

    const handleMouseUp = () => {
      setResizing(null)
      document.body.style.cursor = 'default'
      document.body.style.userSelect = 'auto'
    }

    if (resizing !== null) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [resizing, startX, startWidth])

  const handleResizeStart = (e: React.MouseEvent, index: number) => {
    e.preventDefault()
    const th = (e.target as HTMLElement).closest('th')
    if (th) {
      setResizing(index)
      setStartX(e.clientX)
      setStartWidth(th.offsetWidth)
    }
  }

  useEffect(() => {
    if (!tableRef.current) return

    const headers = tableRef.current.querySelectorAll('th')
    headers.forEach((th, index) => {
      // Remove any existing resize handle
      const existingHandle = th.querySelector('.resize-handle')
      if (existingHandle) existingHandle.remove()

      // Add resize handle
      const handle = document.createElement('div')
      handle.className = 'resize-handle absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-400 hover:w-1.5 transition-all'
      handle.onmousedown = (e) => handleResizeStart(e as any, index)
      handle.onclick = (e) => e.stopPropagation()

      // Make th position relative if not already
      if (window.getComputedStyle(th).position === 'static') {
        th.style.position = 'relative'
      }

      th.appendChild(handle)
    })
  }, [])

  return (
    <table ref={tableRef} className="w-full text-xs">
      {children}
    </table>
  )
}
