"use client"

import { useForm } from 'react-hook-form'
import { Pet, PetSpecies, PetSex } from '@/src/types/pet'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Textarea } from '@/src/components/ui/textarea'
import { cn } from '@/src/lib/utils'
import { useRef } from 'react'

type PetFormData = Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>

interface PetFormProps {
  defaultValues?: Partial<PetFormData>
  onSubmit: (data: PetFormData) => void
  submitLabel?: string
}

const species: { value: PetSpecies; label: string; emoji: string }[] = [
  { value: 'dog', label: '狗', emoji: '🐶' },
  { value: 'cat', label: '猫', emoji: '🐱' },
  { value: 'rabbit', label: '兔', emoji: '🐰' },
  { value: 'bird', label: '鸟', emoji: '🐦' },
  { value: 'reptile', label: '爬行类', emoji: '🦎' },
  { value: 'fish', label: '鱼', emoji: '🐟' },
  { value: 'other', label: '其他', emoji: '🐾' },
]

const sexOptions: { value: PetSex; label: string }[] = [
  { value: 'male', label: '♂ 雄' },
  { value: 'female', label: '♀ 雌' },
  { value: 'unknown', label: '未知' },
]

export function PetForm({ defaultValues, onSubmit, submitLabel = '保存' }: PetFormProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<PetFormData>({
    defaultValues: {
      species: 'dog',
      sex: 'unknown',
      weightUnit: 'kg',
      isDateOfBirthApproximate: false,
      ...defaultValues,
    },
  })

  const selectedSpecies = watch('species')
  const selectedSex = watch('sex')
  const avatarDataUrl = watch('avatarDataUrl')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 500 * 1024) {
      alert('图片不能超过 500KB')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => setValue('avatarDataUrl', ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="h-20 w-20 rounded-full bg-muted flex items-center justify-center text-5xl overflow-hidden border-2 border-dashed border-muted-foreground/30 hover:border-primary transition-colors"
        >
          {avatarDataUrl
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={avatarDataUrl} alt="头像" className="h-full w-full object-cover" />
            : species.find(s => s.value === selectedSpecies)?.emoji}
        </button>
        <span className="text-xs text-muted-foreground">点击上传头像（选填）</span>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
      </div>

      {/* Name */}
      <div className="space-y-1">
        <Label htmlFor="name">名字 <span className="text-destructive">*</span></Label>
        <Input
          id="name"
          placeholder="宠物名字"
          {...register('name', { required: '请输入名字' })}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      {/* Species */}
      <div className="space-y-2">
        <Label>物种 <span className="text-destructive">*</span></Label>
        <div className="grid grid-cols-4 gap-2">
          {species.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setValue('species', s.value)}
              className={cn(
                'flex flex-col items-center gap-1 p-2 rounded-lg border text-sm transition-colors',
                selectedSpecies === s.value
                  ? 'border-primary bg-primary/10 text-primary font-medium'
                  : 'border-muted hover:border-muted-foreground/50'
              )}
            >
              <span className="text-xl">{s.emoji}</span>
              <span className="text-xs">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sex */}
      <div className="space-y-2">
        <Label>性别</Label>
        <div className="flex gap-2">
          {sexOptions.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setValue('sex', o.value)}
              className={cn(
                'flex-1 py-2 rounded-lg border text-sm transition-colors',
                selectedSex === o.value
                  ? 'border-primary bg-primary/10 text-primary font-medium'
                  : 'border-muted hover:border-muted-foreground/50'
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Breed */}
      <div className="space-y-1">
        <Label htmlFor="breed">品种（选填）</Label>
        <Input id="breed" placeholder="如：金毛、英短..." {...register('breed')} />
      </div>

      {/* DOB */}
      <div className="space-y-1">
        <Label htmlFor="dateOfBirth">出生日期（选填）</Label>
        <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          <input type="checkbox" {...register('isDateOfBirthApproximate')} className="rounded" />
          日期为估算
        </label>
      </div>

      {/* Weight unit */}
      <div className="space-y-1">
        <Label>体重单位</Label>
        <div className="flex gap-2">
          {(['kg', 'lbs'] as const).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setValue('weightUnit', u)}
              className={cn(
                'flex-1 py-2 rounded-lg border text-sm transition-colors',
                watch('weightUnit') === u
                  ? 'border-primary bg-primary/10 text-primary font-medium'
                  : 'border-muted hover:border-muted-foreground/50'
              )}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div className="space-y-1">
        <Label htmlFor="color">毛色（选填）</Label>
        <Input id="color" placeholder="如：橘色、黑白花..." {...register('color')} />
      </div>

      {/* Microchip */}
      <div className="space-y-1">
        <Label htmlFor="microchipId">芯片号（选填）</Label>
        <Input id="microchipId" placeholder="15位芯片编号" {...register('microchipId')} />
      </div>

      {/* Notes */}
      <div className="space-y-1">
        <Label htmlFor="notes">备注（选填）</Label>
        <Textarea id="notes" placeholder="其他信息..." rows={3} {...register('notes')} />
      </div>

      <Button type="submit" className="w-full">{submitLabel}</Button>
    </form>
  )
}
