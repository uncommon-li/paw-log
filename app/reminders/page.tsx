"use client"

import { useState } from 'react'
import { TopBar } from '@/src/components/layout/TopBar'
import { PageShell } from '@/src/components/layout/PageShell'
import { ReminderFeed } from '@/src/components/reminders/ReminderFeed'
import { useReminders } from '@/src/hooks/use-reminders'
import { useReminderStore } from '@/src/store/reminder-store'
import { Button } from '@/src/components/ui/button'
import { CheckCheck } from 'lucide-react'

export default function RemindersPage() {
  const { overdue, thisWeek, upcoming, completed } = useReminders()
  const [showCompleted, setShowCompleted] = useState(false)
  const reminders = useReminderStore((s) => s.reminders)
  const total = overdue.length + thisWeek.length + upcoming.length

  return (
    <>
      <TopBar title="所有提醒" right={
        completed.length > 0 && (
          <Button size="sm" variant="ghost" onClick={() => setShowCompleted(!showCompleted)} className="text-xs gap-1">
            <CheckCheck className="h-4 w-4" />
            {showCompleted ? '隐藏' : `已完成(${completed.length})`}
          </Button>
        )
      } />
      <PageShell>
        <ReminderFeed showPetName />

        {showCompleted && completed.length > 0 && (
          <div className="mt-8">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">已完成</p>
            <div className="space-y-2">
              {completed.map((r) => (
                <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl border bg-card opacity-60">
                  <CheckCheck className="h-4 w-4 text-green-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{r.title}</p>
                    {r.completedAt && <p className="text-xs text-muted-foreground">完成于 {r.completedAt.split('T')[0]}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </PageShell>
    </>
  )
}
