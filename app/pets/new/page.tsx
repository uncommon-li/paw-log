"use client"

import { useRouter } from 'next/navigation'
import { TopBar } from '@/src/components/layout/TopBar'
import { PageShell } from '@/src/components/layout/PageShell'
import { PetForm } from '@/src/components/pets/PetForm'
import { usePetStore } from '@/src/store/pet-store'
import { useHealthRecordStore } from '@/src/store/health-record-store'
import { Pet } from '@/src/types/pet'
import { WeightEntry } from '@/src/types/health-record'
import { petHref } from '@/src/lib/pet-path'
import { todayISO } from '@/src/lib/date-utils'

export default function NewPetPage() {
  const router = useRouter()
  const addPet = usePetStore((s) => s.addPet)
  const addRecord = useHealthRecordStore((s) => s.addRecord)

  const handleSubmit = (data: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'> & { initialWeight?: number }) => {
    const { initialWeight, ...petData } = data
    const pet = addPet(petData)
    if (initialWeight && !isNaN(initialWeight) && initialWeight > 0) {
      addRecord({
        petId: pet.id,
        type: 'weight_entry',
        weight: initialWeight,
        unit: pet.weightUnit ?? 'kg',
        recordedAt: todayISO(),
      } as Omit<WeightEntry, 'id' | 'createdAt' | 'updatedAt'>)
    }
    router.push(petHref(pet.id))
  }

  return (
    <>
      <TopBar title="添加宠物" showBack backHref="/pets" />
      <PageShell>
        <PetForm onSubmit={handleSubmit} submitLabel="添加宠物" />
      </PageShell>
    </>
  )
}
