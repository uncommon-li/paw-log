'use client'

import { ReminderSyncProvider } from '@/src/components/ReminderSyncProvider'
import { BottomNav } from '@/src/components/layout/BottomNav'

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <ReminderSyncProvider>
      {children}
      <BottomNav />
    </ReminderSyncProvider>
  )
}
