import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import { Reminder, ReminderStatus } from '@/src/types/reminder'
import { deriveReminders } from '@/src/lib/reminder-sync'
import { ssrSafeStorage } from '@/src/lib/zustand-storage'
import { HealthRecord } from '@/src/types/health-record'

interface ReminderStore {
  reminders: Reminder[]
  syncFromRecords: (records: HealthRecord[]) => void
  addManual: (data: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'sourceRecordId'>) => void
  updateStatus: (id: string, status: ReminderStatus) => void
  snooze: (id: string, days: number) => void
  complete: (id: string) => void
  deleteReminder: (id: string) => void
  deleteByPet: (petId: string) => void
  getRemindersByPet: (petId: string) => Reminder[]
  getAllActive: () => Reminder[]
}

export const useReminderStore = create<ReminderStore>()(
  persist(
    (set, get) => ({
      reminders: [],

      syncFromRecords: (records) => {
        const { toUpsert, toRemoveIds } = deriveReminders(records, get().reminders)
        set((s) => {
          const surviving = s.reminders.filter((r) => !toRemoveIds.includes(r.id))
          const upsertMap = new Map(toUpsert.map((r) => [r.id, r]))
          // Merge upserts: update existing by id, append new
          const merged = surviving.map((r) => upsertMap.get(r.id) ?? r)
          const existingIds = new Set(merged.map((r) => r.id))
          for (const r of toUpsert) {
            if (!existingIds.has(r.id)) merged.push(r)
          }
          return { reminders: merged }
        })
      },

      addManual: (data) => {
        const now = new Date().toISOString()
        const reminder: Reminder = {
          id: uuidv4(),
          status: 'pending',
          createdAt: now,
          updatedAt: now,
          ...data,
        }
        set((s) => ({ reminders: [...s.reminders, reminder] }))
      },

      updateStatus: (id, status) => {
        set((s) => ({
          reminders: s.reminders.map((r) =>
            r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r
          ),
        }))
      },

      snooze: (id, days) => {
        const snoozeUntil = new Date(Date.now() + days * 86400000).toISOString()
        set((s) => ({
          reminders: s.reminders.map((r) =>
            r.id === id
              ? { ...r, status: 'snoozed', snoozeUntil, updatedAt: new Date().toISOString() }
              : r
          ),
        }))
      },

      complete: (id) => {
        const now = new Date().toISOString()
        set((s) => ({
          reminders: s.reminders.map((r) =>
            r.id === id ? { ...r, status: 'completed', completedAt: now, updatedAt: now } : r
          ),
        }))
      },

      deleteReminder: (id) => {
        set((s) => ({ reminders: s.reminders.filter((r) => r.id !== id) }))
      },

      deleteByPet: (petId) => {
        set((s) => ({ reminders: s.reminders.filter((r) => r.petId !== petId) }))
      },

      getRemindersByPet: (petId) => get().reminders.filter((r) => r.petId === petId),

      getAllActive: () => {
        const now = new Date()
        return get().reminders.filter((r) => {
          if (r.status === 'completed') return false
          if (r.status === 'snoozed' && r.snoozeUntil && new Date(r.snoozeUntil) > now) return false
          return true
        })
      },
    }),
    { name: 'paw-log-reminders', storage: ssrSafeStorage }
  )
)
