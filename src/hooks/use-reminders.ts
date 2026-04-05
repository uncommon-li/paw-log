import { useMemo } from 'react'
import { useReminderStore } from '@/src/store/reminder-store'
import { Reminder } from '@/src/types/reminder'
import { isOverdue } from '@/src/lib/date-utils'

export interface GroupedReminders {
  overdue: Reminder[]
  thisWeek: Reminder[]
  upcoming: Reminder[]
  completed: Reminder[]
}

export function useReminders(petId?: string): GroupedReminders {
  const allReminders = useReminderStore((s) => s.reminders)
  const now = new Date()

  const allActive = useMemo(() => {
    return allReminders.filter((r) => {
      if (r.status === 'completed') return false
      if (r.status === 'snoozed' && r.snoozeUntil && new Date(r.snoozeUntil) > now) return false
      return true
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allReminders])

  const active = useMemo(() => {
    const base = petId ? allActive.filter((r) => r.petId === petId) : allActive
    return base
  }, [allActive, petId])

  const completed = useMemo(() => {
    const base = petId ? allReminders.filter((r) => r.petId === petId) : allReminders
    return base.filter((r) => r.status === 'completed')
  }, [allReminders, petId])

  return useMemo(() => {
    const overdue: Reminder[] = []
    const thisWeek: Reminder[] = []
    const upcoming: Reminder[] = []

    for (const r of active) {
      if (isOverdue(r.dueDate)) {
        overdue.push(r)
      } else {
        const days = Math.ceil((new Date(r.dueDate).getTime() - now.getTime()) / 86400000)
        if (days <= 7) thisWeek.push(r)
        else upcoming.push(r)
      }
    }

    // Sort each group by dueDate ascending
    const byDate = (a: Reminder, b: Reminder) => a.dueDate.localeCompare(b.dueDate)
    overdue.sort(byDate)
    thisWeek.sort(byDate)
    upcoming.sort(byDate)

    return { overdue, thisWeek, upcoming, completed }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, completed])
}
