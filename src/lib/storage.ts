import { Pet } from '@/src/types/pet'
import { HealthRecord } from '@/src/types/health-record'
import { Reminder } from '@/src/types/reminder'

export interface ExportData {
  version: 1
  exportedAt: string
  pets: Pet[]
  records: HealthRecord[]
  reminders: Reminder[]
}

export function exportToJSON(data: Omit<ExportData, 'version' | 'exportedAt'>): string {
  const payload: ExportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    ...data,
  }
  return JSON.stringify(payload, null, 2)
}

export function downloadJSON(data: Omit<ExportData, 'version' | 'exportedAt'>, filename = 'paw-log-backup.json') {
  const json = exportToJSON(data)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function parseImportJSON(raw: string): ExportData | null {
  try {
    const data = JSON.parse(raw)
    if (data.version === 1 && Array.isArray(data.pets) && Array.isArray(data.records)) {
      return data as ExportData
    }
    return null
  } catch {
    return null
  }
}

export function getLocalStorageUsageKB(): number {
  let total = 0
  for (const key of Object.keys(localStorage)) {
    total += (localStorage.getItem(key) ?? '').length * 2
  }
  return Math.round(total / 1024)
}
