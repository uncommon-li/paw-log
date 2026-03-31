import { PetSpecies } from '@/src/types/pet'
import { cn } from '@/src/lib/utils'

const speciesEmoji: Record<PetSpecies, string> = {
  dog: '🐶',
  cat: '🐱',
  rabbit: '🐰',
  bird: '🐦',
  reptile: '🦎',
  fish: '🐟',
  other: '🐾',
}

interface PetAvatarProps {
  name: string
  species: PetSpecies
  avatarDataUrl?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'h-10 w-10 text-xl',
  md: 'h-14 w-14 text-3xl',
  lg: 'h-20 w-20 text-5xl',
}

export function PetAvatar({ name, species, avatarDataUrl, size = 'md', className }: PetAvatarProps) {
  if (avatarDataUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarDataUrl}
        alt={name}
        className={cn('rounded-full object-cover', sizeClasses[size], className)}
      />
    )
  }
  return (
    <div
      className={cn(
        'rounded-full bg-muted flex items-center justify-center',
        sizeClasses[size],
        className
      )}
      aria-label={name}
    >
      {speciesEmoji[species]}
    </div>
  )
}
