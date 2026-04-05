"use client"

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { TopBar } from '@/src/components/layout/TopBar'
import { PageShell } from '@/src/components/layout/PageShell'
import { ReminderFeed } from '@/src/components/reminders/ReminderFeed'
import { usePetStore } from '@/src/store/pet-store'
import { petHref } from '@/src/lib/pet-path'

function PetRemindersContent() {
  const searchParams = useSearchParams()
  const petId = searchParams.get('id') ?? ''
  const pet = usePetStore((s) => s.getPet(petId))

  return (
    <>
      <TopBar title={`${pet?.name ?? ''} 的提醒`} showBack backHref={petHref(petId)} />
      <PageShell>
        <ReminderFeed petId={petId} />
      </PageShell>
    </>
  )
}

export default function PetRemindersPage() {
  return (
    <Suspense fallback={null}>
      <PetRemindersContent />
    </Suspense>
  )
}
