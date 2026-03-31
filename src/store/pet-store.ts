import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import { Pet } from '@/src/types/pet'

interface PetStore {
  pets: Pet[]
  addPet: (pet: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>) => Pet
  updatePet: (id: string, patch: Partial<Omit<Pet, 'id' | 'createdAt'>>) => void
  deletePet: (id: string) => void
  getPet: (id: string) => Pet | undefined
}

export const usePetStore = create<PetStore>()(
  persist(
    (set, get) => ({
      pets: [],

      addPet: (data) => {
        const now = new Date().toISOString()
        const pet: Pet = { id: uuidv4(), createdAt: now, updatedAt: now, ...data }
        set((s) => ({ pets: [...s.pets, pet] }))
        return pet
      },

      updatePet: (id, patch) => {
        set((s) => ({
          pets: s.pets.map((p) =>
            p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p
          ),
        }))
      },

      deletePet: (id) => {
        set((s) => ({ pets: s.pets.filter((p) => p.id !== id) }))
      },

      getPet: (id) => get().pets.find((p) => p.id === id),
    }),
    { name: 'paw-log-pets' }
  )
)
