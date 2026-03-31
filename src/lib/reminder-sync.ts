import { HealthRecord } from '@/src/types'
import { Reminder, ReminderType } from '@/src/types/reminder'
import { v4 as uuidv4 } from 'uuid'

interface ReminderSeed {
  sourceRecordId: string
  petId: string
  type: ReminderType
  title: string
  description?: string
  dueDate: string
  leadTimeDays: number
}

function seedsFromRecord(record: HealthRecord): ReminderSeed[] {
  const seeds: ReminderSeed[] = []

  if (record.type === 'vaccination' && record.nextDueDate) {
    seeds.push({
      sourceRecordId: record.id,
      petId: record.petId,
      type: 'vaccine_due',
      title: `${record.vaccineName} 疫苗到期`,
      description: record.administeredBy ? `接种机构: ${record.administeredBy}` : undefined,
      dueDate: record.nextDueDate,
      leadTimeDays: 14,
    })
  }

  if (record.type === 'vet_visit' && record.followUpDate) {
    seeds.push({
      sourceRecordId: record.id,
      petId: record.petId,
      type: 'vet_followup',
      title: '复诊提醒',
      description: record.clinicName ? `诊所: ${record.clinicName}` : undefined,
      dueDate: record.followUpDate,
      leadTimeDays: 7,
    })
  }

  if (record.type === 'medication' && record.refillDate) {
    seeds.push({
      sourceRecordId: record.id,
      petId: record.petId,
      type: 'medication_refill',
      title: `${record.medicationName} 补药提醒`,
      description: `用法: ${record.dosage} ${record.frequency}`,
      dueDate: record.refillDate,
      leadTimeDays: 7,
    })
  }

  if (record.type === 'dental' && record.nextCleaningDate) {
    seeds.push({
      sourceRecordId: record.id,
      petId: record.petId,
      type: 'dental_cleaning',
      title: '牙齿清洁到期',
      dueDate: record.nextCleaningDate,
      leadTimeDays: 14,
    })
  }

  if (record.type === 'surgery' && record.followUpDate) {
    seeds.push({
      sourceRecordId: record.id,
      petId: record.petId,
      type: 'surgery_followup',
      title: `${record.procedureName} 术后复查`,
      dueDate: record.followUpDate,
      leadTimeDays: 7,
    })
  }

  return seeds
}

/**
 * Derive reminders from health records.
 * Returns new/updated reminders; caller merges them into the store.
 * Idempotent: keyed by sourceRecordId + type.
 */
export function deriveReminders(
  records: HealthRecord[],
  existing: Reminder[]
): { toUpsert: Reminder[]; toRemoveIds: string[] } {
  const now = new Date().toISOString()
  const seeds = records.flatMap(seedsFromRecord)

  // Build a lookup of existing derived reminders by (sourceRecordId, type)
  const existingMap = new Map<string, Reminder>()
  for (const r of existing) {
    if (r.sourceRecordId) {
      existingMap.set(`${r.sourceRecordId}:${r.type}`, r)
    }
  }

  // Determine which derived record IDs are still valid
  const validKeys = new Set(seeds.map((s) => `${s.sourceRecordId}:${s.type}`))

  // Derived reminders that no longer have a seed should be removed
  const toRemoveIds: string[] = []
  for (const [key, reminder] of existingMap) {
    if (!validKeys.has(key)) toRemoveIds.push(reminder.id)
  }

  const toUpsert: Reminder[] = seeds.map((seed) => {
    const key = `${seed.sourceRecordId}:${seed.type}`
    const existing = existingMap.get(key)
    if (existing) {
      // Update dueDate in case record was edited; preserve status
      return { ...existing, dueDate: seed.dueDate, description: seed.description, updatedAt: now }
    }
    return {
      id: uuidv4(),
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      ...seed,
    } satisfies Reminder
  })

  return { toUpsert, toRemoveIds }
}
