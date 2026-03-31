"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, PawPrint, Bell, Settings } from 'lucide-react'
import { cn } from '@/src/lib/utils'
import { useReminderStore } from '@/src/store/reminder-store'

const tabs = [
  { href: '/dashboard', label: '首页', icon: LayoutDashboard },
  { href: '/pets', label: '宠物', icon: PawPrint },
  { href: '/reminders', label: '提醒', icon: Bell },
  { href: '/settings', label: '设置', icon: Settings },
]

export function BottomNav() {
  const pathname = usePathname()
  const activeCount = useReminderStore((s) => s.getAllActive()).length

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-background border-t safe-area-pb">
      <div className="flex">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          const showBadge = href === '/reminders' && activeCount > 0
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center gap-0.5 py-2 text-xs transition-colors',
                active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <span className="relative">
                <Icon className="h-5 w-5" />
                {showBadge && (
                  <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-destructive text-[9px] text-white flex items-center justify-center font-bold">
                    {activeCount > 9 ? '9+' : activeCount}
                  </span>
                )}
              </span>
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
