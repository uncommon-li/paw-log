"use client"

import { Reminder } from '@/src/types/reminder'
import { useReminderStore } from '@/src/store/reminder-store'
import { useHealthRecordStore } from '@/src/store/health-record-store'
import { usePetStore } from '@/src/store/pet-store'
import { dueDateLabel, isOverdue, todayISO } from '@/src/lib/date-utils'
import { MedicationRecord } from '@/src/types/health-record'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Check, Clock, Trash2, Pill } from 'lucide-react'
import { cn } from '@/src/lib/utils'

const typeLabel: Record<string, string> = {
  vaccine_due: '疫苗',
  medication_refill: '用药',
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
  const updateRecord = useHealthRecordStore((s) => s.updateRecord)
  const getRecord = useHealthRecordStore((s) => s.getRecord)
  const pet = usePetStore((s) => s.getPet(reminder.petId))
  const overdue = isOverdue(reminder.dueDate)
  const label = dueDateLabel(reminder.dueDate)

  // For medication reminders, look up the source medication record
  const sourceMedication =
    reminder.type === 'medication_refill' && reminder.sourceRecordId
      ? (getRecord(reminder.sourceRecordId) as MedicationRecord | undefined)
      : undefined
  const isRecurring = !!sourceMedication?.recurringIntervalDays

  // "今天给了" — marks complete and advances refillDate by the recurring interval
  const handleGaveToday = () => {
    if (sourceMedication?.recurringIntervalDays) {
      const today = new Date()
      const nextDate = new Date(today.getTime() + sourceMedication.recurringIntervalDays * 86400000)
      const nextISO = nextDate.toISOString().split('T')[0]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateRecord(sourceMedication.id, { refillDate: nextISO, recordedAt: todayISO() } as any)
    }
    complete(reminder.id)
  }

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
            {isRecurring && (
              <Badge variant="outline" className="text-xs shrink-0 gap-1">
                <Pill className="h-2.5 w-2.5" />
                每{sourceMedication!.recurringIntervalDays}天
              </Badge>
            )}
            {showPetName && pet && (
              <span className="text-xs text-muted-foreground">{pet.name}</span>
            )}
          </div>
          <p className="font-medium mt-1 text-sm">{reminder.title}</p>
          {reminder.description && (
            <p className="text-xs text-muted-foreground mt-0.5">{reminder.description}</p>
          )}
        </div>
        <span className={cn(
          'text-xs font-medium shrink-0 mt-1',
          overdue ? 'text-destructive' : 'text-amber-600 dark:text-amber-400'
        )}>
          {label}
        </span>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="h-8 text-xs gap-1 px-3"
          onClick={() => snooze(reminder.id, 3)}
        >
          <Clock className="h-3 w-3" />
          推迟3天
        </Button>

        {/* Medication with recurring interval: show "今天给了" as primary CTA */}
        {isRecurring ? (
          <Button
            size="sm"
            className="flex-1 h-8 text-xs gap-1 bg-green-600 hover:bg-green-700 text-white"
            onClick={handleGaveToday}
          >
            <Check className="h-3 w-3" />
            今天给了 ✓
          </Button>
        ) : (
          <Button
            size="sm"
            className="flex-1 h-8 text-xs gap-1"
            onClick={() => complete(reminder.id)}
          >
            <Check className="h-3 w-3" />
            已完成
          </Button>
        )}

        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
          onClick={() => deleteReminder(reminder.id)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {/* Show next auto-scheduled date hint for recurring meds */}
      {isRecurring && (
        <p className="text-xs text-muted-foreground">
          点击后自动安排下次提醒（{sourceMedication!.recurringIntervalDays}天后）
        </p>
      )}
    </div>
  )
}
