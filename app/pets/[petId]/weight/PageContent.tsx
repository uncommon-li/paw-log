"use client"

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { TopBar } from '@/src/components/layout/TopBar'
import { PageShell } from '@/src/components/layout/PageShell'
import { WeightChart } from '@/src/components/weight/WeightChart'
import { useHealthRecordStore } from '@/src/store/health-record-store'
import { usePetStore } from '@/src/store/pet-store'
import { WeightEntry } from '@/src/types/health-record'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog'
import { Plus } from 'lucide-react'
import { todayISO, formatDate } from '@/src/lib/date-utils'
import { cn } from '@/src/lib/utils'
import { petHref } from '@/src/lib/pet-path'

function WeightContent() {
  const searchParams = useSearchParams()
  const petId = searchParams.get('id') ?? ''
  const pet = usePetStore((s) => s.getPet(petId))
  const allRecords = useHealthRecordStore((s) => s.records)
  const addRecord = useHealthRecordStore((s) => s.addRecord)
  const [open, setOpen] = useState(false)
  const [weight, setWeight] = useState('')
  const [unit, setUnit] = useState<'kg' | 'lbs'>(pet?.weightUnit ?? 'kg')
  const [date, setDate] = useState(todayISO())

  const weightEntries = useMemo(() =>
    (allRecords
      .filter((r) => r.petId === petId && r.type === 'weight_entry')
      .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))) as WeightEntry[]
  , [allRecords, petId])

  const handleAdd = () => {
    const val = parseFloat(weight)
    if (isNaN(val) || val <= 0) return
    addRecord({
      petId,
      type: 'weight_entry',
      weight: val,
      unit,
      recordedAt: date,
    } as Omit<WeightEntry, 'id' | 'createdAt' | 'updatedAt'>)
    setWeight('')
    setDate(todayISO())
    setOpen(false)
  }

  return (
    <>
      <TopBar
        title={`${pet?.name ?? ''} 体重追踪`}
        showBack
        backHref={petHref(petId)}
        right={
          <Button size="sm" variant="ghost" onClick={() => setOpen(true)}>
            <Plus className="h-5 w-5" />
          </Button>
        }
      />
      <PageShell>
        <div className="mb-6">
          <WeightChart entries={weightEntries} unit={pet?.weightUnit ?? 'kg'} />
        </div>

        {weightEntries.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">历史记录</p>
            {weightEntries.map((e, i) => (
              <div key={e.id} className="flex items-center justify-between p-3 rounded-xl border bg-card">
                <span className="text-sm text-muted-foreground">{formatDate(e.recordedAt)}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{e.weight} {e.unit}</span>
                  {i > 0 && (() => {
                    const prev = weightEntries[i - 1]
                    const diff = e.weight - prev.weight
                    return (
                      <span className={cn('text-xs', diff > 0 ? 'text-amber-500' : 'text-green-500')}>
                        {diff > 0 ? '+' : ''}{diff.toFixed(2)}
                      </span>
                    )
                  })()}
                </div>
              </div>
            ))}
          </div>
        )}
      </PageShell>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>记录体重</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>体重</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="flex-1"
                />
                <div className="flex gap-1">
                  {(['kg', 'lbs'] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUnit(u)}
                      className={cn('px-3 rounded-md border text-sm', unit === u ? 'bg-primary text-primary-foreground border-primary' : 'border-input')}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <Label>日期</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <Button onClick={handleAdd} className="w-full">保存</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function WeightPage() {
  return (
    <Suspense fallback={null}>
      <WeightContent />
    </Suspense>
  )
}
