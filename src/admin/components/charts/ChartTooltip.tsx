export function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name?: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-lg shadow-lg border border-border-light px-3 py-2">
      <p className="text-xs font-semibold text-navy">{label}</p>
      <p className="text-sm font-bold text-navy-dark">{payload[0].value}</p>
    </div>
  )
}

export function PieTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-lg shadow-lg border border-border-light px-3 py-2">
      <p className="text-xs font-semibold text-navy">{payload[0].name}</p>
      <p className="text-sm font-bold text-navy-dark">{payload[0].value} students</p>
    </div>
  )
}

export function NoChartData({ message = 'No data available' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center h-full w-full text-text-gray">
      <div className="text-center">
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  )
}
