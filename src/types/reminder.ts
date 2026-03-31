export type ReminderType =
  | 'vaccine_due'
  | 'medication_refill'
  | 'vet_followup'
  | 'dental_cleaning'
  | 'surgery_followup'
  | 'manual'

export type ReminderStatus = 'pending' | 'snoozed' | 'completed' | 'overdue'

export interface Reminder {
  id: string
  petId: string
  type: ReminderType
  title: string
  description?: string
  dueDate: string        // ISO date
  status: ReminderStatus
  sourceRecordId?: string
  snoozeUntil?: string   // ISO datetime
  completedAt?: string
  leadTimeDays: number   // days before dueDate to surface
  createdAt: string
  updatedAt: string
}
