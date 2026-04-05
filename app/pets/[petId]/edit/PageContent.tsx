"use client"

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { TopBar } from '@/src/components/layout/TopBar'
import { PageShell } from '@/src/components/layout/PageShell'
import { PetForm } from '@/src/components/pets/PetForm'
import { usePetStore } from '@/src/store/pet-store'
import { Pet } from '@/src/types/pet'
import { petHref } from '@/src/lib/pet-path'

function EditPetContent() {
  const searchParams = useSearchParams()
  const petId = searchParams.get('id') ?? ''
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
    router.push(petHref(petId))
  }

  return (
    <>
      <TopBar title={`编辑 ${pet.name}`} showBack backHref={petHref(petId)} />
      <PageShell>
        <PetForm defaultValues={pet} onSubmit={handleSubmit} submitLabel="保存修改" />
      </PageShell>
    </>
  )
}

export default function EditPetPage() {
  return (
    <Suspense fallback={null}>
      <EditPetContent />
    </Suspense>
  )
}
