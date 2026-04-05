"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, PawPrint, Bell, Settings } from 'lucide-react'
import { cn } from '@/src/lib/utils'
import { useReminderStore } from '@/src/store/reminder-store'
import { useMemo } from 'react'

const tabs = [
  { href: '/dashboard', label: '首页', icon: LayoutDashboard },
  { href: '/pets', label: '宠物', icon: PawPrint },
  { href: '/reminders', label: '提醒', icon: Bell },
  { href: '/settings', label: '设置', icon: Settings },
]

export function BottomNav() {
  const pathname = usePathname()
  const reminders = useReminderStore((s) => s.reminders)
  const activeCount = useMemo(() => {
    const now = new Date()
    return reminders.filter((r) => {
      if (r.status === 'completed') return false
      if (r.status === 'snoozed' && r.snoozeUntil && new Date(r.snoozeUntil) > now) return false
      return true
    }).length
  }, [reminders])

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 safe-area-pb">
      <div className="mx-3 mb-3 bg-white/90 backdrop-blur-md rounded-3xl shadow-lg shadow-pink-200/50 border border-pink-100 flex">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          const showBadge = href === '/reminders' && activeCount > 0
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center py-2 gap-0.5"
            >
              <span className={cn(
                'relative flex items-center justify-center w-10 h-8 rounded-2xl transition-all',
                active
                  ? 'bg-gradient-to-r from-pink-400 to-fuchsia-400 shadow-md shadow-pink-200 scale-110'
                  : ''
              )}>
                <Icon className={cn('h-5 w-5 transition-colors', active ? 'text-white' : 'text-muted-foreground')} />
                {showBadge && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 text-[9px] text-white flex items-center justify-center font-bold shadow-sm">
                    {activeCount > 9 ? '9+' : activeCount}
                  </span>
                )}
              </span>
              <span className={cn('text-[10px] font-semibold transition-colors', active ? 'text-primary' : 'text-muted-foreground')}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
