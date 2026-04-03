"use client"

import { TopBar } from '@/src/components/layout/TopBar'
import { PageShell } from '@/src/components/layout/PageShell'
import { PetCard } from '@/src/components/pets/PetCard'
import { ReminderCard } from '@/src/components/reminders/ReminderCard'
import { usePetStore } from '@/src/store/pet-store'
import { useReminderStore } from '@/src/store/reminder-store'
import Link from 'next/link'
import { Button } from '@/src/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { isOverdue, isSoon } from '@/src/lib/date-utils'
import { Reminder } from '@/src/types/reminder'

// Sort reminders: overdue first, then by dueDate ascending
function sortByUrgency(reminders: Reminder[]) {
  return [...reminders].sort((a, b) => {
    const aOver = isOverdue(a.dueDate) ? 0 : 1
    const bOver = isOverdue(b.dueDate) ? 0 : 1
    if (aOver !== bOver) return aOver - bOver
    return a.dueDate.localeCompare(b.dueDate)
  })
}

export default function DashboardPage() {
  const pets = usePetStore((s) => s.pets)
  const activeReminders = useReminderStore((s) => s.getAllActive())

  // Medication reminders that are due today/overdue — top CTA
  const urgentMeds = sortByUrgency(
    activeReminders.filter(
      (r) => r.type === 'medication_refill' && (isOverdue(r.dueDate) || isSoon(r.dueDate, 0))
    )
  )

  // All other active reminders (non-urgent-meds), capped to 5 on dashboard
  const urgentMedIds = new Set(urgentMeds.map((r) => r.id))
  const otherReminders = sortByUrgency(
    activeReminders.filter((r) => !urgentMedIds.has(r.id))
  ).slice(0, 5)

  const totalOther = activeReminders.filter((r) => !urgentMedIds.has(r.id)).length

  return (
    <>
      <TopBar title="Paw Log 🐾" />
      <PageShell>
        {/* ── Today's medications — primary CTA ── */}
        {urgentMeds.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">💊</span>
              <h2 className="text-sm font-semibold">今日用药</h2>
              <span className="text-xs bg-destructive text-destructive-foreground rounded-full px-1.5 py-0.5 font-medium">
                {urgentMeds.length}
              </span>
            </div>
            <div className="space-y-2">
              {urgentMeds.map((r) => (
                <ReminderCard key={r.id} reminder={r} showPetName />
              ))}
            </div>
          </section>
        )}

        {/* ── Pet strip ── */}
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

        {/* ── Empty state ── */}
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

        {/* ── Other reminders (vaccines, vet followups, etc.) ── */}
        {pets.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                其他提醒
                {totalOther > 0 && <span className="ml-1.5 text-destructive">({totalOther})</span>}
              </h2>
              <Link href="/reminders" className="text-xs text-primary">全部</Link>
            </div>
            {otherReminders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-2xl mb-2">🎉</p>
                <p className="text-sm text-muted-foreground">暂无其他待办提醒</p>
              </div>
            ) : (
              <div className="space-y-2">
                {otherReminders.map((r) => (
                  <ReminderCard key={r.id} reminder={r} showPetName />
                ))}
                {totalOther > 5 && (
                  <Link href="/reminders" className="block text-center text-sm text-primary py-2">
                    还有 {totalOther - 5} 条提醒 →
                  </Link>
                )}
              </div>
            )}
          </section>
        )}
      </PageShell>
    </>
  )
}
