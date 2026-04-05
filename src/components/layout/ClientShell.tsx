'use client'

import { useEffect } from 'react'
import { ReminderSyncProvider } from '@/src/components/ReminderSyncProvider'
import { BottomNav } from '@/src/components/layout/BottomNav'

export function ClientShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Configure native status bar when running inside Capacitor
    const cap = (window as unknown as { Capacitor?: { isNativePlatform: () => boolean } }).Capacitor
    if (cap?.isNativePlatform()) {
      import('@capacitor/status-bar').then(({ StatusBar, Style }) => {
        StatusBar.setOverlaysWebView({ overlay: true })
        StatusBar.setStyle({ style: Style.Light })
      }).catch(() => {})
    }
  }, [])

  return (
    <ReminderSyncProvider>
      {children}
      <BottomNav />
    </ReminderSyncProvider>
  )
}
