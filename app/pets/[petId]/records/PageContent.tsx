"use client"

import { use, useState } from 'react'
import Link from 'next/link'
import { TopBar } from '@/src/components/layout/TopBar'
import { PageShell } from '@/src/components/layout/PageShell'
import { RecordTimeline } from '@/src/components/records/RecordTimeline'
import { recordTypeMeta } from '@/src/components/records/RecordTypeSelector'
import { useHealthRecordStore } from '@/src/store/health-record-store'
import { HealthRecord, HealthRecordType } from '@/src/types/health-record'
import { usePetStore } from '@/src/store/pet-store'
import { Button } from '@/src/components/ui/button'
import { Plus } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/src/components/ui/sheet'
import { formatDate } from '@/src/lib/date-utils'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/src/components/ui/alert-dialog'
import { Trash2 } from 'lucide-react'
import { cn } from '@/src/lib/utils'

function RecordDetail({ record, onClose, onDelete }: { record: HealthRecord; onClose: () => void; onDelete: (id: string) => void }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const meta = recordTypeMeta[record.type]
  const Icon = meta.icon

  const details: { label: string; value: string | number | boolean | undefined }[] = []

  switch (record.type) {
    case 'vaccination':
      details.push(
        { label: '疫苗名称', value: record.vaccineName },
        { label: '接种机构', value: record.administeredBy },
        { label: '批次号', value: record.lotNumber },
        { label: '下次接种', value: record.nextDueDate ? formatDate(record.nextDueDate) : undefined },
        { label: '加强针', value: record.isBooster ? '是' : '否' },
      )
      break
    case 'vet_visit':
      details.push(
        { label: '就诊原因', value: record.reasonForVisit },
        { label: '诊所', value: record.clinicName },
        { label: '医生', value: record.veterinarianName },
        { label: '诊断', value: record.diagnosis },
        { label: '处理方案', value: record.treatmentSummary },
        { label: '复诊日期', value: record.followUpDate ? formatDate(record.followUpDate) : undefined },
        { label: '费用', value: record.cost ? `¥${record.cost}` : undefined },
      )
      break
    case 'medication':
      details.push(
        { label: '药物名称', value: record.medicationName },
        { label: '剂量', value: record.dosage },
        { label: '频率', value: record.frequency },
        { label: '开始日期', value: formatDate(record.startDate) },
        { label: '结束日期', value: record.endDate ? formatDate(record.endDate) : undefined },
        { label: '补药日期', value: record.refillDate ? formatDate(record.refillDate) : undefined },
        { label: '处方医生', value: record.prescribedBy },
        { label: '持续用药', value: record.isOngoing ? '是' : '否' },
      )
      break
    case 'weight_entry':
      details.push({ label: '体重', value: `${record.weight} ${record.unit}` })
      break
    case 'dental':
      details.push(
        { label: '处理内容', value: record.procedure },
        { label: '下次清洁', value: record.nextCleaningDate ? formatDate(record.nextCleaningDate) : undefined },
      )
      break
    case 'surgery':
      details.push(
        { label: '手术名称', value: record.procedureName },
        { label: '手术医生', value: record.surgeonName },
        { label: '医院', value: record.clinicName },
        { label: '复查日期', value: record.followUpDate ? formatDate(record.followUpDate) : undefined },
      )
      break
    case 'note':
      details.push({ label: '标题', value: record.title })
      break
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            <Icon className={cn('h-5 w-5', meta.color)} />
          </div>
          <div>
            <p className="font-semibold">{meta.label}</p>
            <p className="text-sm text-muted-foreground">{formatDate(record.recordedAt)}</p>
          </div>
        </div>

        <div className="space-y-2">
          {details.filter(d => d.value !== undefined && d.value !== '').map(({ label, value }) => (
            <div key={label} className="flex justify-between gap-4 text-sm py-1.5 border-b last:border-0">
              <span className="text-muted-foreground shrink-0">{label}</span>
              <span className="text-right">{String(value)}</span>
            </div>
          ))}
          {record.notes && (
            <div className="text-sm py-1.5">
              <span className="text-muted-foreground block mb-1">备注</span>
              <p>{record.notes}</p>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => setConfirmDelete(true)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          删除记录
        </Button>
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除这条记录？</AlertDialogTitle>
            <AlertDialogDescription>删除后无法恢复，相关提醒也将同步删除。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => { onDelete(record.id); onClose() }}
            >
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default function RecordsPage({ params }: { params: Promise<{ petId: string }> }) {
  const { petId } = use(params)
  const pet = usePetStore((s) => s.getPet(petId))
  const records = useHealthRecordStore((s) => s.getRecordsByPet(petId))
  const deleteRecord = useHealthRecordStore((s) => s.deleteRecord)
  const [selected, setSelected] = useState<HealthRecord | null>(null)
  const [filterType, setFilterType] = useState<HealthRecordType | 'all'>('all')

  const filtered = filterType === 'all' ? records : records.filter((r) => r.type === filterType)

  return (
    <>
      <TopBar
        title={`${pet?.name ?? ''} 的健康记录`}
        showBack
        backHref={`/pets/${petId}`}
        right={
          <Button asChild size="sm" variant="ghost">
            <Link href={`/pets/${petId}/records/new`}><Plus className="h-5 w-5" /></Link>
          </Button>
        }
      />
      <PageShell>
        {/* Filter tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-3 mb-4 -mx-4 px-4">
          <button
            onClick={() => setFilterType('all')}
            className={cn('shrink-0 px-3 py-1.5 rounded-full text-xs border transition-colors', filterType === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'border-input text-muted-foreground')}
          >
            全部 ({records.length})
          </button>
          {(Object.entries(recordTypeMeta) as [HealthRecordType, typeof recordTypeMeta[HealthRecordType]][]).map(([type, meta]) => {
            const count = records.filter((r) => r.type === type).length
            if (count === 0) return null
            return (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={cn('shrink-0 px-3 py-1.5 rounded-full text-xs border transition-colors', filterType === type ? 'bg-primary text-primary-foreground border-primary' : 'border-input text-muted-foreground')}
              >
                {meta.label} ({count})
              </button>
            )
          })}
        </div>

        <RecordTimeline records={filtered} onRecordClick={setSelected} />
      </PageShell>

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle>记录详情</SheetTitle>
          </SheetHeader>
          {selected && (
            <RecordDetail
              record={selected}
              onClose={() => setSelected(null)}
              onDelete={(id) => { deleteRecord(id); setSelected(null) }}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
