import { HealthRecordType } from '@/src/types/health-record'
import { cn } from '@/src/lib/utils'
import { Syringe, Stethoscope, Pill, Scale, Smile, Scissors, FileText } from 'lucide-react'

export const recordTypeMeta: Record<HealthRecordType, { label: string; icon: React.ElementType; color: string }> = {
  vaccination: { label: '疫苗', icon: Syringe, color: 'text-blue-500' },
  vet_visit: { label: '就诊', icon: Stethoscope, color: 'text-green-500' },
  medication: { label: '用药', icon: Pill, color: 'text-purple-500' },
  weight_entry: { label: '体重', icon: Scale, color: 'text-orange-500' },
  dental: { label: '口腔', icon: Smile, color: 'text-pink-500' },
  surgery: { label: '手术', icon: Scissors, color: 'text-red-500' },
  note: { label: '备注', icon: FileText, color: 'text-gray-500' },
}

interface RecordTypeSelectorProps {
  selected?: HealthRecordType
  onSelect: (type: HealthRecordType) => void
}

export function RecordTypeSelector({ selected, onSelect }: RecordTypeSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {(Object.entries(recordTypeMeta) as [HealthRecordType, typeof recordTypeMeta[HealthRecordType]][]).map(
        ([type, meta]) => {
          const Icon = meta.icon
          return (
            <button
              key={type}
              type="button"
              onClick={() => onSelect(type)}
              className={cn(
                'flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-colors',
                selected === type
                  ? 'border-primary bg-primary/10'
                  : 'border-muted hover:border-muted-foreground/50'
              )}
            >
              <Icon className={cn('h-5 w-5', meta.color)} />
              <span className="text-xs">{meta.label}</span>
            </button>
          )
        }
      )}
    </div>
  )
}
