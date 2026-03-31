"use client"

import { TopBar } from '@/src/components/layout/TopBar'
import { PageShell } from '@/src/components/layout/PageShell'
import { PetCard } from '@/src/components/pets/PetCard'
import { usePetStore } from '@/src/store/pet-store'
import { Button } from '@/src/components/ui/button'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'

export default function PetsPage() {
  const pets = usePetStore((s) => s.pets)

  return (
    <>
      <TopBar
        title="我的宠物"
        right={
          <Button asChild size="sm" variant="ghost">
            <Link href="/pets/new"><PlusCircle className="h-5 w-5" /></Link>
          </Button>
        }
      />
      <PageShell>
        {pets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-5xl mb-4">🐾</p>
            <p className="font-medium mb-1">还没有宠物档案</p>
            <p className="text-sm text-muted-foreground mb-6">添加你的宠物，开始记录健康日志</p>
            <Button asChild>
              <Link href="/pets/new">
                <PlusCircle className="h-4 w-4 mr-2" />
                添加宠物
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {pets.map((pet) => <PetCard key={pet.id} pet={pet} />)}
          </div>
        )}
      </PageShell>
    </>
  )
}
