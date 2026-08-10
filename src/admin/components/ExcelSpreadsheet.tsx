import type { ReactNode } from 'react'

export interface ExcelColumn<T> {
  key: string
  header: string
  render: (row: T, index: number) => ReactNode
  align?: 'left' | 'center' | 'right'
}

interface ExcelSpreadsheetProps<T> {
  data: T[]
  columns: ExcelColumn<T>[]
  maxHeight?: number
}

export default function ExcelSpreadsheet<T>({ data, columns, maxHeight = 560 }: ExcelSpreadsheetProps<T>) {
  return (
    <div className="overflow-auto max-h-[560px] border border-gray-300 bg-white rounded-none" style={{ maxHeight: `${maxHeight}px` }}>
      <table className="w-full border-collapse text-[12px]">
        <thead className="sticky top-0 z-10">
          {/* Excel column letters (A, B, C...) */}
          <tr className="bg-[#3B3B3B]">
            {['S.No', ...columns.map((c) => c.header)].map((_, i) => (
              <th
                key={`letter-${i}`}
                className="border border-[#555555] px-2 py-0.5 text-center text-[10px] font-bold text-white/80 tracking-wider"
              >
                {String.fromCharCode(65 + i)}
              </th>
            ))}
          </tr>
          {/* Header row */}
          <tr className="bg-[#217346]">
            <th className="border border-[#1B5E20] px-2.5 py-1.5 text-left text-[11px] font-bold text-white whitespace-nowrap">S.No</th>
            {columns.map((c) => (
              <th
                key={c.key}
                className="border border-[#1B5E20] px-2.5 py-1.5 text-left text-[11px] font-bold text-white whitespace-nowrap"
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#F1F6F2] hover:bg-[#E3F0E6]'}>
              <td className="border border-gray-300 px-2 py-1.5 text-center text-gray-500">{idx + 1}</td>
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={`border border-gray-300 px-2.5 py-1.5 text-gray-700 whitespace-nowrap ${
                    c.align === 'center' ? 'text-center' : c.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {c.render(row, idx)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
