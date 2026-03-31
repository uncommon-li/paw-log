"use client"

import Link from 'next/link'
import { Pet } from '@/src/types/pet'
import { PetAvatar } from './PetAvatar'
import { Badge } from '@/src/components/ui/badge'
import { useReminders } from '@/src/hooks/use-reminders'
import { formatAge } from '@/src/lib/date-utils'
import { Bell } from 'lucide-react'

const speciesLabel: Record<string, string> = {
  dog: '狗', cat: '猫', rabbit: '兔', bird: '鸟', reptile: '爬行类', fish: '鱼', other: '其他',
}

interface PetCardProps {
  pet: Pet
}

export function PetCard({ pet }: PetCardProps) {
  const { overdue, thisWeek } = useReminders(pet.id)
  const urgentCount = overdue.length + thisWeek.length

  return (
    <Link href={`/pets/${pet.id}`}>
      <div className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors">
        <PetAvatar name={pet.name} species={pet.species} avatarDataUrl={pet.avatarDataUrl} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold truncate">{pet.name}</span>
            <Badge variant="secondary" className="text-xs shrink-0">
              {speciesLabel[pet.species]}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {pet.breed || speciesLabel[pet.species]}
            {pet.dateOfBirth && ` · ${formatAge(pet.dateOfBirth, pet.isDateOfBirthApproximate)}`}
          </p>
        </div>
        {urgentCount > 0 && (
          <div className="flex items-center gap-1 text-destructive">
            <Bell className="h-4 w-4" />
            <span className="text-xs font-medium">{urgentCount}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
