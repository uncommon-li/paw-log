"use client"

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/src/lib/utils'

interface TopBarProps {
  title: string
  showBack?: boolean
  backHref?: string
  right?: React.ReactNode
  className?: string
}

export function TopBar({ title, showBack, backHref, right, className }: TopBarProps) {
  const router = useRouter()

  const handleBack = () => {
    if (backHref) router.push(backHref)
    else router.back()
  }

  return (
    <header className={cn('sticky top-0 z-30 bg-background border-b', className)}>
      <div className="flex items-center h-14 px-4 max-w-2xl mx-auto">
        {showBack && (
          <button
            onClick={handleBack}
            className="mr-2 -ml-2 p-2 rounded-md hover:bg-muted transition-colors"
            aria-label="返回"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        <h1 className="flex-1 font-semibold text-base truncate">{title}</h1>
        {right && <div className="ml-2">{right}</div>}
      </div>
    </header>
  )
}
