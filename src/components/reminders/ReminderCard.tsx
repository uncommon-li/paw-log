"use client"

import { Reminder } from '@/src/types/reminder'
import { useReminderStore } from '@/src/store/reminder-store'
import { usePetStore } from '@/src/store/pet-store'
import { dueDateLabel, isOverdue } from '@/src/lib/date-utils'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Check, Clock, Trash2 } from 'lucide-react'
import { cn } from '@/src/lib/utils'

const typeLabel: Record<string, string> = {
  vaccine_due: '疫苗',
  medication_refill: '补药',
  vet_followup: '复诊',
  dental_cleaning: '口腔',
  surgery_followup: '复查',
  manual: '提醒',
}

interface ReminderCardProps {
  reminder: Reminder
  showPetName?: boolean
}

export function ReminderCard({ reminder, showPetName }: ReminderCardProps) {
  const { complete, snooze, deleteReminder } = useReminderStore()
  const pet = usePetStore((s) => s.getPet(reminder.petId))
  const overdue = isOverdue(reminder.dueDate)
  const label = dueDateLabel(reminder.dueDate)

  return (
    <div className={cn(
      'p-4 rounded-xl border bg-card space-y-2',
      overdue && 'border-destructive/50 bg-destructive/5',
    )}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={overdue ? 'destructive' : 'secondary'} className="text-xs shrink-0">
              {typeLabel[reminder.type] ?? '提醒'}
            </Badge>
            {showPetName && pet && (
              <span className="text-xs text-muted-foreground">{pet.name}</span>
            )}
          </div>
          <p className="font-medium mt-1 text-sm">{reminder.title}</p>
          {reminder.description && (
            <p className="text-xs text-muted-foreground mt-0.5">{reminder.description}</p>
          )}
        </div>
        <span className={cn('text-xs font-medium shrink-0 mt-1', overdue ? 'text-destructive' : 'text-amber-600 dark:text-amber-400')}>
          {label}
        </span>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 h-8 text-xs gap-1"
          onClick={() => snooze(reminder.id, 7)}
        >
          <Clock className="h-3 w-3" />
          推迟7天
        </Button>
        <Button
          size="sm"
          className="flex-1 h-8 text-xs gap-1"
          onClick={() => complete(reminder.id)}
        >
          <Check className="h-3 w-3" />
          已完成
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
          onClick={() => deleteReminder(reminder.id)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
