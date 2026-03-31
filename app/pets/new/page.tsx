"use client"

import { useRouter } from 'next/navigation'
import { TopBar } from '@/src/components/layout/TopBar'
import { PageShell } from '@/src/components/layout/PageShell'
import { PetForm } from '@/src/components/pets/PetForm'
import { usePetStore } from '@/src/store/pet-store'
import { Pet } from '@/src/types/pet'

export default function NewPetPage() {
  const router = useRouter()
  const addPet = usePetStore((s) => s.addPet)

  const handleSubmit = (data: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>) => {
    const pet = addPet(data)
    router.push(`/pets/${pet.id}`)
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
