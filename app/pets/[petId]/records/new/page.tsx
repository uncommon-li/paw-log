"use client"

import { use, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { TopBar } from '@/src/components/layout/TopBar'
import { PageShell } from '@/src/components/layout/PageShell'
import { RecordTypeSelector, recordTypeMeta } from '@/src/components/records/RecordTypeSelector'
import { RecordForm } from '@/src/components/records/RecordForms'
import { useHealthRecordStore } from '@/src/store/health-record-store'
import { HealthRecord, HealthRecordType } from '@/src/types/health-record'
import { usePetStore } from '@/src/store/pet-store'

// useSearchParams must be inside a Suspense boundary
function NewRecordContent({ petId }: { petId: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pet = usePetStore((s) => s.getPet(petId))
  const addRecord = useHealthRecordStore((s) => s.addRecord)

  const defaultType = (searchParams.get('type') as HealthRecordType) || undefined
  const [recordType, setRecordType] = useState<HealthRecordType | undefined>(defaultType)

  const handleSubmit = (data: Omit<HealthRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    addRecord(data)
    router.push(`/pets/${petId}/records`)
  }

  return (
    <>
      <TopBar
        title={recordType ? `添加${recordTypeMeta[recordType].label}记录` : '添加健康记录'}
        showBack
        backHref={recordType ? undefined : `/pets/${petId}/records`}
      />
      <PageShell>
        {!recordType ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">选择记录类型</p>
            <RecordTypeSelector onSelect={setRecordType} />
          </div>
        ) : (
          <RecordForm
            petId={petId}
            type={recordType}
            onSubmit={handleSubmit}
            submitLabel="添加记录"
          />
        )}
      </PageShell>
    </>
  )
}

export default function NewRecordPage({ params }: { params: Promise<{ petId: string }> }) {
  const { petId } = use(params)
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-32 text-muted-foreground text-sm">加载中...</div>}>
      <NewRecordContent petId={petId} />
    </Suspense>
  )
}
