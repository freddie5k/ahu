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

  const enhanceTable = (table: React.ReactElement) => {
    if (!table || table.type !== 'table') return table

    const thead = table.props.children.find((child: any) => child?.type === 'thead')
    if (!thead) return table

    const tr = thead.props.children
    if (!tr || !tr.props || !tr.props.children) return table

    const enhancedTh = tr.props.children.map((th: any, index: number) => {
      if (!th || th.type !== 'th') return th

      return {
        ...th,
        props: {
          ...th.props,
          className: `${th.props.className || ''} relative`,
          children: (
            <>
              {th.props.children}
              <div
                className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-400 hover:w-1.5 transition-all"
                onMouseDown={(e) => handleResizeStart(e, index)}
                onClick={(e) => e.stopPropagation()}
              />
            </>
          ),
        },
      }
    })

    const enhancedTr = {
      ...tr,
      props: {
        ...tr.props,
        children: enhancedTh,
      },
    }

    const enhancedThead = {
      ...thead,
      props: {
        ...thead.props,
        children: enhancedTr,
      },
    }

    const enhancedChildren = table.props.children.map((child: any) => {
      if (child?.type === 'thead') return enhancedThead
      return child
    })

    return {
      ...table,
      ref: tableRef,
      props: {
        ...table.props,
        children: enhancedChildren,
      },
    }
  }

  const enhancedChildren = Array.isArray(children)
    ? children.map((child) => {
        if (child && typeof child === 'object' && 'type' in child && child.type === 'table') {
          return enhanceTable(child as React.ReactElement)
        }
        return child
      })
    : typeof children === 'object' && children && 'type' in children && (children as any).type === 'table'
    ? enhanceTable(children as React.ReactElement)
    : children

  return <>{enhancedChildren}</>
}
