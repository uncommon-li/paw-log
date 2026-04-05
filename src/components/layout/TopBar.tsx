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
    <header
      className={cn(
        'sticky top-0 z-30 bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 shadow-md shadow-pink-200/50 safe-area-pt',
        className
      )}
    >
      <div className="flex items-center h-14 px-4 max-w-2xl mx-auto">
        {showBack && (
          <button
            onClick={handleBack}
            className="mr-2 -ml-2 p-2 rounded-full hover:bg-white/20 transition-colors text-white"
            aria-label="返回"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        <h1 className="flex-1 font-bold text-base truncate text-white drop-shadow-sm">{title}</h1>
        {right && <div className="ml-2 text-white [&_button]:text-white [&_svg]:stroke-white">{right}</div>}
      </div>
    </header>
  )
}
