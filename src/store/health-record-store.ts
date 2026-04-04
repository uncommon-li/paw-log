import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import { HealthRecord, HealthRecordType } from '@/src/types/health-record'
import { ssrSafeStorage } from '@/src/lib/zustand-storage'

interface HealthRecordStore {
  records: HealthRecord[]
  addRecord: (record: Omit<HealthRecord, 'id' | 'createdAt' | 'updatedAt'>) => HealthRecord
  updateRecord: (id: string, patch: Partial<Omit<HealthRecord, 'id' | 'petId' | 'type' | 'createdAt'>>) => void
  deleteRecord: (id: string) => void
  getRecord: (id: string) => HealthRecord | undefined
  getRecordsByPet: (petId: string) => HealthRecord[]
  getRecordsByType: (petId: string, type: HealthRecordType) => HealthRecord[]
  deleteByPet: (petId: string) => void
}

export const useHealthRecordStore = create<HealthRecordStore>()(
  persist(
    (set, get) => ({
      records: [],

      addRecord: (data) => {
        const now = new Date().toISOString()
        const record = { id: uuidv4(), createdAt: now, updatedAt: now, ...data } as HealthRecord
        set((s) => ({ records: [...s.records, record] }))
        return record
      },

      updateRecord: (id, patch) => {
        set((s) => ({
          records: s.records.map((r) =>
            r.id === id ? ({ ...r, ...patch, updatedAt: new Date().toISOString() } as HealthRecord) : r
          ),
        }))
      },

      deleteRecord: (id) => {
        set((s) => ({ records: s.records.filter((r) => r.id !== id) }))
      },

      getRecord: (id) => get().records.find((r) => r.id === id),

      getRecordsByPet: (petId) =>
        get()
          .records.filter((r) => r.petId === petId)
          .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt)),

      getRecordsByType: (petId, type) =>
        get()
          .records.filter((r) => r.petId === petId && r.type === type)
          .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt)),

      deleteByPet: (petId) => {
        set((s) => ({ records: s.records.filter((r) => r.petId !== petId) }))
      },
    }),
    { name: 'paw-log-records', storage: ssrSafeStorage }
  )
)
