import { cn } from '@/src/lib/utils'

interface PageShellProps {
  children: React.ReactNode
  className?: string
  noPadding?: boolean
}

export function PageShell({ children, className, noPadding }: PageShellProps) {
  return (
    <main className={cn('max-w-2xl mx-auto pb-28', !noPadding && 'px-4 pt-4', className)}>
      {children}
    </main>
  )
}
