"use client"

import { useReminders } from '@/src/hooks/use-reminders'
import { ReminderCard } from './ReminderCard'

interface ReminderFeedProps {
  petId?: string
  showPetName?: boolean
}

export function ReminderFeed({ petId, showPetName }: ReminderFeedProps) {
  const { overdue, thisWeek, upcoming } = useReminders(petId)
  const total = overdue.length + thisWeek.length + upcoming.length

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-4xl mb-3">🎉</p>
        <p className="font-medium">没有待办提醒</p>
        <p className="text-sm text-muted-foreground mt-1">所有提醒都已处理完毕</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {overdue.length > 0 && (
        <section>
          <p className="text-xs font-semibold text-destructive uppercase tracking-wide mb-2">已逾期</p>
          <div className="space-y-2">
            {overdue.map((r) => <ReminderCard key={r.id} reminder={r} showPetName={showPetName} />)}
          </div>
        </section>
      )}
      {thisWeek.length > 0 && (
        <section>
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-2">本周到期</p>
          <div className="space-y-2">
            {thisWeek.map((r) => <ReminderCard key={r.id} reminder={r} showPetName={showPetName} />)}
          </div>
        </section>
      )}
      {upcoming.length > 0 && (
        <section>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">即将到来</p>
          <div className="space-y-2">
            {upcoming.map((r) => <ReminderCard key={r.id} reminder={r} showPetName={showPetName} />)}
          </div>
        </section>
      )}
    </div>
  )
}
