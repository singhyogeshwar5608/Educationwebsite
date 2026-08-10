import type { ReactNode } from 'react'

export interface Column<T> {
  key: string
  header: string
  align?: 'left' | 'right'
  width?: string
  render: (row: T) => ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  mobileCard?: (row: T) => ReactNode
}

export default function DataTable<T>({ columns, data }: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-gray-400">
        No data available
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-100">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100 ${
                  col.align === 'right' ? 'text-right' : 'text-left'
                }`}
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              className="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-3 text-sm text-gray-700 ${
                    col.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
