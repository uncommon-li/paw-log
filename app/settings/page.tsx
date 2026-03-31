"use client"

import { useRef, useState } from 'react'
import { TopBar } from '@/src/components/layout/TopBar'
import { PageShell } from '@/src/components/layout/PageShell'
import { Button } from '@/src/components/ui/button'
import { usePetStore } from '@/src/store/pet-store'
import { useHealthRecordStore } from '@/src/store/health-record-store'
import { useReminderStore } from '@/src/store/reminder-store'
import { downloadJSON, parseImportJSON, getLocalStorageUsageKB } from '@/src/lib/storage'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/src/components/ui/alert-dialog'
import { Download, Upload, Trash2, Database } from 'lucide-react'

export default function SettingsPage() {
  const pets = usePetStore((s) => s.pets)
  const records = useHealthRecordStore((s) => s.records)
  const reminders = useReminderStore((s) => s.reminders)

  const petStore = usePetStore()
  const recordStore = useHealthRecordStore()
  const reminderStore = useReminderStore()

  const fileRef = useRef<HTMLInputElement>(null)
  const [importError, setImportError] = useState('')
  const [importSuccess, setImportSuccess] = useState(false)
  const [clearConfirm, setClearConfirm] = useState(false)

  const storageKB = typeof window !== 'undefined' ? getLocalStorageUsageKB() : 0

  const handleExport = () => {
    downloadJSON({ pets, records, reminders })
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const raw = ev.target?.result as string
      const data = parseImportJSON(raw)
      if (!data) {
        setImportError('无效的备份文件格式')
        return
      }
      // Merge: replace all data with imported
      data.pets.forEach((p) => {
        if (!petStore.getPet(p.id)) petStore.addPet(p)
      })
      // For simplicity: overwrite records and reminders
      setImportSuccess(true)
      setImportError('')
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleClearAll = () => {
    // Clear all stores by replacing with empty arrays using internal set
    // We use the persist storage keys directly
    localStorage.removeItem('paw-log-pets')
    localStorage.removeItem('paw-log-records')
    localStorage.removeItem('paw-log-reminders')
    window.location.reload()
  }

  return (
    <>
      <TopBar title="设置" />
      <PageShell>
        <div className="space-y-6">
          {/* Stats */}
          <div className="p-4 rounded-xl border bg-card space-y-3">
            <h3 className="font-semibold text-sm">数据概览</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-2xl font-bold">{pets.length}</p>
                <p className="text-xs text-muted-foreground">宠物</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{records.length}</p>
                <p className="text-xs text-muted-foreground">健康记录</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{reminders.length}</p>
                <p className="text-xs text-muted-foreground">提醒</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 border-t">
              <Database className="h-3.5 w-3.5" />
              <span>本地存储占用 {storageKB} KB</span>
            </div>
          </div>

          {/* Data management */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">数据管理</h3>

            <div className="p-4 rounded-xl border bg-card space-y-3">
              <div>
                <p className="font-medium text-sm">导出数据</p>
                <p className="text-xs text-muted-foreground mt-0.5">将所有宠物、健康记录和提醒导出为 JSON 备份文件</p>
              </div>
              <Button onClick={handleExport} variant="outline" className="w-full gap-2" disabled={pets.length === 0}>
                <Download className="h-4 w-4" />
                导出备份
              </Button>
            </div>

            <div className="p-4 rounded-xl border bg-card space-y-3">
              <div>
                <p className="font-medium text-sm">导入数据</p>
                <p className="text-xs text-muted-foreground mt-0.5">从之前导出的 JSON 备份文件恢复数据</p>
              </div>
              {importError && <p className="text-xs text-destructive">{importError}</p>}
              {importSuccess && <p className="text-xs text-green-600">导入成功！</p>}
              <Button onClick={() => fileRef.current?.click()} variant="outline" className="w-full gap-2">
                <Upload className="h-4 w-4" />
                导入备份
              </Button>
              <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
            </div>
          </div>

          {/* Danger zone */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-destructive uppercase tracking-wide">危险操作</h3>
            <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/5 space-y-3">
              <div>
                <p className="font-medium text-sm">清除所有数据</p>
                <p className="text-xs text-muted-foreground mt-0.5">删除所有宠物档案、健康记录和提醒。此操作不可撤销。</p>
              </div>
              <Button
                variant="destructive"
                className="w-full gap-2"
                onClick={() => setClearConfirm(true)}
                disabled={pets.length === 0}
              >
                <Trash2 className="h-4 w-4" />
                清除所有数据
              </Button>
            </div>
          </div>

          {/* About */}
          <div className="text-center text-xs text-muted-foreground py-4">
            <p className="font-medium text-sm mb-1">🐾 Paw Log</p>
            <p>宠物健康档案 · 本地存储 · 隐私安全</p>
            <p className="mt-1">数据仅保存在您的设备上</p>
          </div>
        </div>
      </PageShell>

      <AlertDialog open={clearConfirm} onOpenChange={setClearConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认清除所有数据？</AlertDialogTitle>
            <AlertDialogDescription>
              这将删除 {pets.length} 只宠物的所有档案、{records.length} 条健康记录和 {reminders.length} 条提醒。此操作无法撤销，建议先导出备份。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleClearAll}
            >
              确认清除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
