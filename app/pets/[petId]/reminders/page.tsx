"use client"

import { use } from 'react'
import { TopBar } from '@/src/components/layout/TopBar'
import { PageShell } from '@/src/components/layout/PageShell'
import { ReminderFeed } from '@/src/components/reminders/ReminderFeed'
import { usePetStore } from '@/src/store/pet-store'

export default function PetRemindersPage({ params }: { params: Promise<{ petId: string }> }) {
  const { petId } = use(params)
  const pet = usePetStore((s) => s.getPet(petId))

  return (
    <>
      <TopBar title={`${pet?.name ?? ''} 的提醒`} showBack backHref={`/pets/${petId}`} />
      <PageShell>
        <ReminderFeed petId={petId} />
      </PageShell>
    </>
  )
}
