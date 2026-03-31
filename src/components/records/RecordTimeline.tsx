"use client"

import { HealthRecord } from '@/src/types/health-record'
import { formatDate } from '@/src/lib/date-utils'
import { recordTypeMeta } from './RecordTypeSelector'
import { cn } from '@/src/lib/utils'
import { format, parseISO } from 'date-fns'

interface RecordTimelineProps {
  records: HealthRecord[]
  onRecordClick: (record: HealthRecord) => void
}

function getRecordTitle(record: HealthRecord): string {
  switch (record.type) {
    case 'vaccination': return record.vaccineName
    case 'vet_visit': return record.reasonForVisit
    case 'medication': return record.medicationName
    case 'weight_entry': return `${record.weight} ${record.unit}`
    case 'dental': return record.procedure
    case 'surgery': return record.procedureName
    case 'note': return record.title
  }
}

function getRecordSubtitle(record: HealthRecord): string | undefined {
  switch (record.type) {
    case 'vaccination': return record.administeredBy
    case 'vet_visit': return record.clinicName
    case 'medication': return `${record.dosage} · ${record.frequency}`
    case 'dental': return record.notes
    case 'surgery': return record.clinicName
    default: return record.notes
  }
}

// Group records by month
function groupByMonth(records: HealthRecord[]): [string, HealthRecord[]][] {
  const map = new Map<string, HealthRecord[]>()
  for (const r of records) {
    const key = format(parseISO(r.recordedAt), 'yyyy年MM月')
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(r)
  }
  return Array.from(map.entries())
}

export function RecordTimeline({ records, onRecordClick }: RecordTimelineProps) {
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-4xl mb-3">📋</p>
        <p className="text-muted-foreground">还没有健康记录</p>
        <p className="text-sm text-muted-foreground">点击右上角 + 添加第一条记录</p>
      </div>
    )
  }

  const groups = groupByMonth(records)

  return (
    <div className="space-y-6">
      {groups.map(([month, recs]) => (
        <div key={month}>
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">{month}</p>
          <div className="space-y-2">
            {recs.map((record) => {
              const meta = recordTypeMeta[record.type]
              const Icon = meta.icon
              const title = getRecordTitle(record)
              const subtitle = getRecordSubtitle(record)
              return (
                <button
                  key={record.id}
                  onClick={() => onRecordClick(record)}
                  className="w-full flex items-start gap-3 p-3 rounded-xl border bg-card hover:bg-accent/50 transition-colors text-left"
                >
                  <div className="mt-0.5 h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <Icon className={cn('h-4 w-4', meta.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-sm truncate">{title}</span>
                      <span className="text-xs text-muted-foreground shrink-0">{formatDate(record.recordedAt)}</span>
                    </div>
                    {subtitle && <p className="text-xs text-muted-foreground truncate mt-0.5">{subtitle}</p>}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
