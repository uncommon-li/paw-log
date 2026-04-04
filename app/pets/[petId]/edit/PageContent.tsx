"use client"

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { TopBar } from '@/src/components/layout/TopBar'
import { PageShell } from '@/src/components/layout/PageShell'
import { PetForm } from '@/src/components/pets/PetForm'
import { usePetStore } from '@/src/store/pet-store'
import { Pet } from '@/src/types/pet'

export default function EditPetPage({ params }: { params: Promise<{ petId: string }> }) {
  const { petId } = use(params)
  const router = useRouter()
  const pet = usePetStore((s) => s.getPet(petId))
  const updatePet = usePetStore((s) => s.updatePet)

  if (!pet) {
    return (
      <>
        <TopBar title="编辑宠物" showBack />
        <PageShell><p className="text-center text-muted-foreground py-20">未找到该宠物</p></PageShell>
      </>
    )
  }

  const handleSubmit = (data: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>) => {
    updatePet(petId, data)
    router.push(`/pets/${petId}`)
  }

  return (
    <>
      <TopBar title={`编辑 ${pet.name}`} showBack backHref={`/pets/${petId}`} />
      <PageShell>
        <PetForm defaultValues={pet} onSubmit={handleSubmit} submitLabel="保存修改" />
      </PageShell>
    </>
  )
}
