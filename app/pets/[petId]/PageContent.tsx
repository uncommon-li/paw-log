"use client"

import { useMemo, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { TopBar } from '@/src/components/layout/TopBar'
import { PageShell } from '@/src/components/layout/PageShell'
import { PetAvatar } from '@/src/components/pets/PetAvatar'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { usePetStore } from '@/src/store/pet-store'
import { useHealthRecordStore } from '@/src/store/health-record-store'
import { useReminderStore } from '@/src/store/reminder-store'
import { formatAge, formatDate } from '@/src/lib/date-utils'
import { petHref } from '@/src/lib/pet-path'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/src/components/ui/alert-dialog'
import { Syringe, Stethoscope, Scale, Bell, Pencil, Trash2, ChevronRight } from 'lucide-react'

const speciesLabel: Record<string, string> = {
  dog: '狗', cat: '猫', rabbit: '兔', bird: '鸟', reptile: '爬行类', fish: '鱼', other: '其他',
}

function PetDetailContent() {
  const searchParams = useSearchParams()
  const petId = searchParams.get('id') ?? ''
  const router = useRouter()

  const pet = usePetStore((s) => s.getPet(petId))
  const deletePet = usePetStore((s) => s.deletePet)
  const allRecords = useHealthRecordStore((s) => s.records)
  const deleteByPet = useHealthRecordStore((s) => s.deleteByPet)
  const deleteRemindersByPet = useReminderStore((s) => s.deleteByPet)
  const allReminders = useReminderStore((s) => s.reminders)

  const records = useMemo(() =>
    allRecords
      .filter((r) => r.petId === petId)
      .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))
  , [allRecords, petId])

  const activeReminders = useMemo(() => {
    const now = new Date()
    return allReminders.filter((r) => {
      if (r.petId !== petId) return false
      if (r.status === 'completed') return false
      if (r.status === 'snoozed' && r.snoozeUntil && new Date(r.snoozeUntil) > now) return false
      return true
    })
  }, [allReminders, petId])

  if (!pet) {
    return (
      <>
        <TopBar title="宠物详情" showBack backHref="/pets" />
        <PageShell>
          <p className="text-center text-muted-foreground py-20">未找到该宠物</p>
        </PageShell>
      </>
    )
  }

  const vaccinations = records.filter((r) => r.type === 'vaccination').length
  const weightEntries = records.filter((r) => r.type === 'weight_entry')
  const lastWeight = weightEntries[0]

  const handleDelete = () => {
    deleteByPet(petId)
    deleteRemindersByPet(petId)
    deletePet(petId)
    router.push('/pets')
  }

  return (
    <>
      <TopBar
        title={pet.name}
        showBack
        backHref="/pets"
        right={
          <Link href={petHref(petId, 'edit')}>
            <Button size="sm" variant="ghost"><Pencil className="h-4 w-4" /></Button>
          </Link>
        }
      />
      <PageShell>
        {/* Hero */}
        <div className="flex flex-col items-center py-6 gap-3">
          <PetAvatar name={pet.name} species={pet.species} avatarDataUrl={pet.avatarDataUrl} size="lg" />
          <div className="text-center">
            <h2 className="text-xl font-bold">{pet.name}</h2>
            <div className="flex items-center justify-center gap-2 mt-1 flex-wrap">
              <Badge variant="secondary">{speciesLabel[pet.species]}</Badge>
              {pet.breed && <span className="text-sm text-muted-foreground">{pet.breed}</span>}
              {pet.sex !== 'unknown' && <span className="text-sm text-muted-foreground">{pet.sex === 'male' ? '♂' : '♀'}</span>}
            </div>
            {pet.dateOfBirth && (
              <p className="text-sm text-muted-foreground mt-1">
                {formatAge(pet.dateOfBirth, pet.isDateOfBirthApproximate)} · 生于 {formatDate(pet.dateOfBirth)}
              </p>
            )}
          </div>
        </div>

        {/* Quick-add shortcuts */}
        <div className="flex gap-2 mb-5">
          <Link href={petHref(petId, 'records/new', { type: 'medication' })} className="flex-1">
            <div className="flex flex-col items-center gap-1 py-3 rounded-xl border bg-card hover:bg-accent/50 transition-colors">
              <span className="text-xl">💊</span>
              <span className="text-xs font-medium">记录用药</span>
            </div>
          </Link>
          <Link href={petHref(petId, 'records/new', { type: 'vaccination' })} className="flex-1">
            <div className="flex flex-col items-center gap-1 py-3 rounded-xl border bg-card hover:bg-accent/50 transition-colors">
              <span className="text-xl">💉</span>
              <span className="text-xs font-medium">记录疫苗</span>
            </div>
          </Link>
          <Link href={petHref(petId, 'records/new', { type: 'vet_visit' })} className="flex-1">
            <div className="flex flex-col items-center gap-1 py-3 rounded-xl border bg-card hover:bg-accent/50 transition-colors">
              <span className="text-xl">🩺</span>
              <span className="text-xs font-medium">记录就诊</span>
            </div>
          </Link>
          <Link href={petHref(petId, 'weight')} className="flex-1">
            <div className="flex flex-col items-center gap-1 py-3 rounded-xl border bg-card hover:bg-accent/50 transition-colors">
              <span className="text-xl">⚖️</span>
              <span className="text-xs font-medium">记录体重</span>
            </div>
          </Link>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="flex flex-col items-center p-3 rounded-xl border bg-card">
            <Syringe className="h-5 w-5 text-blue-500 mb-1" />
            <span className="text-lg font-bold">{vaccinations}</span>
            <span className="text-xs text-muted-foreground">疫苗记录</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-xl border bg-card">
            <Scale className="h-5 w-5 text-orange-500 mb-1" />
            <span className="text-lg font-bold">
              {lastWeight ? `${(lastWeight as { weight: number }).weight}` : '-'}
            </span>
            <span className="text-xs text-muted-foreground">{lastWeight ? `${(lastWeight as { unit: string }).unit}` : '体重'}</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-xl border bg-card">
            <Bell className="h-5 w-5 text-destructive mb-1" />
            <span className="text-lg font-bold">{activeReminders.length}</span>
            <span className="text-xs text-muted-foreground">待办提醒</span>
          </div>
        </div>

        {/* Navigation links */}
        <div className="space-y-2 mb-8">
          <Link href={petHref(petId, 'records')} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              <Stethoscope className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium text-sm">健康记录</p>
                <p className="text-xs text-muted-foreground">{records.length} 条记录</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>

          <Link href={petHref(petId, 'weight')} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              <Scale className="h-5 w-5 text-orange-500" />
              <div>
                <p className="font-medium text-sm">体重追踪</p>
                <p className="text-xs text-muted-foreground">{weightEntries.length} 条记录</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>

          <Link href={petHref(petId, 'reminders')} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">提醒事项</p>
                <p className="text-xs text-muted-foreground">{activeReminders.length} 条待办</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>

        {/* Delete */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4 mr-2" />
              删除宠物档案
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认删除 {pet.name}？</AlertDialogTitle>
              <AlertDialogDescription>
                这将删除 {pet.name} 的所有健康记录和提醒，且无法撤销。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                确认删除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </PageShell>
    </>
  )
}

export default function PetDetailPage() {
  return (
    <Suspense fallback={null}>
      <PetDetailContent />
    </Suspense>
  )
}
