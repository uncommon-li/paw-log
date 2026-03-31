"use client"

import { TopBar } from '@/src/components/layout/TopBar'
import { PageShell } from '@/src/components/layout/PageShell'
import { PetCard } from '@/src/components/pets/PetCard'
import { ReminderFeed } from '@/src/components/reminders/ReminderFeed'
import { usePetStore } from '@/src/store/pet-store'
import { useReminderStore } from '@/src/store/reminder-store'
import Link from 'next/link'
import { Button } from '@/src/components/ui/button'
import { PlusCircle } from 'lucide-react'

export default function DashboardPage() {
  const pets = usePetStore((s) => s.pets)
  const activeReminders = useReminderStore((s) => s.getAllActive())

  return (
    <>
      <TopBar title="Paw Log 🐾" />
      <PageShell>
        {/* Pet strip */}
        {pets.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">我的宠物</h2>
              <Link href="/pets/new" className="text-xs text-primary">+ 添加</Link>
            </div>
            <div className="space-y-2">
              {pets.slice(0, 3).map((pet) => <PetCard key={pet.id} pet={pet} />)}
              {pets.length > 3 && (
                <Link href="/pets" className="block text-center text-sm text-primary py-2">
                  查看全部 {pets.length} 只宠物
                </Link>
              )}
            </div>
          </section>
        )}

        {/* Empty state: no pets */}
        {pets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-6xl mb-4">🐾</p>
            <h2 className="text-lg font-semibold mb-1">欢迎使用 Paw Log</h2>
            <p className="text-muted-foreground text-sm mb-6">先添加你的第一只宠物，开始记录健康档案</p>
            <Button asChild>
              <Link href="/pets/new">
                <PlusCircle className="h-4 w-4 mr-2" />
                添加宠物
              </Link>
            </Button>
          </div>
        )}

        {/* Reminders */}
        {pets.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                待办提醒
                {activeReminders.length > 0 && (
                  <span className="ml-2 text-destructive">({activeReminders.length})</span>
                )}
              </h2>
              <Link href="/reminders" className="text-xs text-primary">全部</Link>
            </div>
            <ReminderFeed showPetName />
          </section>
        )}
      </PageShell>
    </>
  )
}
