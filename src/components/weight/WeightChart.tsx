"use client"

import { WeightEntry } from '@/src/types/health-record'
import { formatDate } from '@/src/lib/date-utils'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useMemo, useState } from 'react'
import { cn } from '@/src/lib/utils'
import { subMonths } from 'date-fns'

interface WeightChartProps {
  entries: WeightEntry[]
  unit: 'kg' | 'lbs'
}

const ranges = [
  { label: '1月', months: 1 },
  { label: '3月', months: 3 },
  { label: '1年', months: 12 },
  { label: '全部', months: 0 },
]

export function WeightChart({ entries, unit }: WeightChartProps) {
  const [rangeMonths, setRangeMonths] = useState(3)

  const data = useMemo(() => {
    const cutoff = rangeMonths > 0 ? subMonths(new Date(), rangeMonths) : null
    return entries
      .filter((e) => !cutoff || new Date(e.recordedAt) >= cutoff)
      .sort((a, b) => a.recordedAt.localeCompare(b.recordedAt))
      .map((e) => ({
        date: formatDate(e.recordedAt),
        weight: e.unit === unit ? e.weight : unit === 'kg' ? +(e.weight * 0.453592).toFixed(2) : +(e.weight / 0.453592).toFixed(2),
      }))
  }, [entries, rangeMonths, unit])

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center">
        <p className="text-muted-foreground text-sm">还没有体重记录</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-1">
        {ranges.map((r) => (
          <button
            key={r.label}
            onClick={() => setRangeMonths(r.months)}
            className={cn(
              'flex-1 py-1 text-xs rounded-md border transition-colors',
              rangeMonths === r.months
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-input text-muted-foreground hover:border-muted-foreground'
            )}
          >
            {r.label}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} unit={unit} />
          <Tooltip
            formatter={(v) => [`${v} ${unit}`, '体重']}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
