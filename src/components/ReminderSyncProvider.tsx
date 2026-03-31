"use client"

import { useEffect } from 'react'
import { useHealthRecordStore } from '@/src/store/health-record-store'
import { useReminderStore } from '@/src/store/reminder-store'

export function ReminderSyncProvider({ children }: { children: React.ReactNode }) {
  const records = useHealthRecordStore((s) => s.records)
  const syncFromRecords = useReminderStore((s) => s.syncFromRecords)

  useEffect(() => {
    syncFromRecords(records)
  }, [records, syncFromRecords])

  return <>{children}</>
}
