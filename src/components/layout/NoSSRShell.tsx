'use client'

import dynamic from 'next/dynamic'

const ClientShell = dynamic(
  () => import('./ClientShell').then((m) => ({ default: m.ClientShell })),
  { ssr: false }
)

export function NoSSRShell({ children }: { children: React.ReactNode }) {
  return <ClientShell>{children}</ClientShell>
}
