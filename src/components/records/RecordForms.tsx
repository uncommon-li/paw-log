"use client"

import { useForm, type UseFormRegister } from 'react-hook-form'
import { HealthRecord, HealthRecordType } from '@/src/types/health-record'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Textarea } from '@/src/components/ui/textarea'
import { todayISO } from '@/src/lib/date-utils'

interface RecordFormProps {
  petId: string
  type: HealthRecordType
  defaultValues?: Partial<HealthRecord>
  onSubmit: (data: Omit<HealthRecord, 'id' | 'createdAt' | 'updatedAt'>) => void
  submitLabel?: string
}

// Shared date + notes fields used by all forms
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SharedFields({ register }: { register: UseFormRegister<any> }) {
  return (
    <>
      <div className="space-y-1">
        <Label htmlFor="recordedAt">日期 <span className="text-destructive">*</span></Label>
        <Input id="recordedAt" type="date" {...register('recordedAt', { required: true })} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="notes">备注（选填）</Label>
        <Textarea id="notes" placeholder="其他说明..." rows={2} {...register('notes')} />
      </div>
    </>
  )
}

export function RecordForm({ petId, type, defaultValues, onSubmit, submitLabel = '保存' }: RecordFormProps) {
  const form = useForm({
    defaultValues: {
      petId,
      type,
      recordedAt: todayISO(),
      ...defaultValues,
    },
  })
  const { register, handleSubmit, watch, setValue } = form

  const handleFormSubmit = (data: Record<string, unknown>) => {
    onSubmit(data as Omit<HealthRecord, 'id' | 'createdAt' | 'updatedAt'>)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <input type="hidden" {...register('petId')} />
      <input type="hidden" {...register('type')} />

      {type === 'vaccination' && (
        <>
          <div className="space-y-1">
            <Label htmlFor="vaccineName">疫苗名称 <span className="text-destructive">*</span></Label>
            <Input id="vaccineName" placeholder="如：狂犬病、猫三联..." {...register('vaccineName', { required: true })} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="administeredBy">接种机构（选填）</Label>
            <Input id="administeredBy" placeholder="诊所/医院名称" {...register('administeredBy')} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="lotNumber">批次号（选填）</Label>
            <Input id="lotNumber" {...register('lotNumber')} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="nextDueDate">下次接种日期（选填）</Label>
            <Input id="nextDueDate" type="date" {...register('nextDueDate')} />
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" {...register('isBooster')} className="rounded" />
            这是加强针
          </label>
        </>
      )}

      {type === 'vet_visit' && (
        <>
          <div className="space-y-1">
            <Label htmlFor="reasonForVisit">就诊原因 <span className="text-destructive">*</span></Label>
            <Input id="reasonForVisit" placeholder="如：常规体检、皮肤问题..." {...register('reasonForVisit', { required: true })} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="clinicName">诊所/医院（选填）</Label>
            <Input id="clinicName" {...register('clinicName')} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="veterinarianName">医生（选填）</Label>
            <Input id="veterinarianName" {...register('veterinarianName')} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="diagnosis">诊断（选填）</Label>
            <Textarea id="diagnosis" rows={2} {...register('diagnosis')} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="treatmentSummary">处理方案（选填）</Label>
            <Textarea id="treatmentSummary" rows={2} {...register('treatmentSummary')} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="followUpDate">复诊日期（选填）</Label>
            <Input id="followUpDate" type="date" {...register('followUpDate')} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="cost">费用（选填）</Label>
            <Input id="cost" type="number" step="0.01" placeholder="0.00" {...register('cost', { valueAsNumber: true })} />
          </div>
        </>
      )}

      {type === 'medication' && (
        <>
          <div className="space-y-1">
            <Label htmlFor="medicationName">药物名称 <span className="text-destructive">*</span></Label>
            <Input id="medicationName" placeholder="如：心丝虫预防药..." {...register('medicationName', { required: true })} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="dosage">剂量 <span className="text-destructive">*</span></Label>
            <Input id="dosage" placeholder="如：1片、5mg..." {...register('dosage', { required: true })} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="frequency">频率 <span className="text-destructive">*</span></Label>
            <Input id="frequency" placeholder="如：每天一次、每月一次..." {...register('frequency', { required: true })} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="startDate">开始日期</Label>
            <Input id="startDate" type="date" {...register('startDate')} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="endDate">结束日期（选填）</Label>
            <Input id="endDate" type="date" {...register('endDate')} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="refillDate">补药提醒日期（选填）</Label>
            <Input id="refillDate" type="date" {...register('refillDate')} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="prescribedBy">处方医生（选填）</Label>
            <Input id="prescribedBy" {...register('prescribedBy')} />
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" {...register('isOngoing')} className="rounded" />
            持续用药中
          </label>
        </>
      )}

      {type === 'weight_entry' && (
        <>
          <div className="space-y-1">
            <Label htmlFor="weight">体重 <span className="text-destructive">*</span></Label>
            <div className="flex gap-2">
              <Input
                id="weight"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="flex-1"
                {...register('weight', { required: true, valueAsNumber: true })}
              />
              <div className="flex gap-1">
                {(['kg', 'lbs'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setValue('unit', u)}
                    className={`px-3 rounded-md border text-sm transition-colors ${watch('unit') === u ? 'bg-primary text-primary-foreground border-primary' : 'border-input'}`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {type === 'dental' && (
        <>
          <div className="space-y-1">
            <Label htmlFor="procedure">处理内容 <span className="text-destructive">*</span></Label>
            <Input id="procedure" placeholder="如：洁牙、拔牙..." {...register('procedure', { required: true })} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="nextCleaningDate">下次清洁日期（选填）</Label>
            <Input id="nextCleaningDate" type="date" {...register('nextCleaningDate')} />
          </div>
        </>
      )}

      {type === 'surgery' && (
        <>
          <div className="space-y-1">
            <Label htmlFor="procedureName">手术名称 <span className="text-destructive">*</span></Label>
            <Input id="procedureName" placeholder="如：绝育手术..." {...register('procedureName', { required: true })} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="surgeonName">手术医生（选填）</Label>
            <Input id="surgeonName" {...register('surgeonName')} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="clinicName">医院（选填）</Label>
            <Input id="clinicName" {...register('clinicName')} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="followUpDate">复查日期（选填）</Label>
            <Input id="followUpDate" type="date" {...register('followUpDate')} />
          </div>
        </>
      )}

      {type === 'note' && (
        <div className="space-y-1">
          <Label htmlFor="title">标题 <span className="text-destructive">*</span></Label>
          <Input id="title" placeholder="备注标题" {...register('title', { required: true })} />
        </div>
      )}

      <SharedFields register={register} />
      <Button type="submit" className="w-full">{submitLabel}</Button>
    </form>
  )
}
