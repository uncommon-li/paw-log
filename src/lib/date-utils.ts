import {
  differenceInDays,
  differenceInYears,
  differenceInMonths,
  format,
  parseISO,
  isAfter,
  isBefore,
  addDays,
} from 'date-fns'

export function formatDate(iso: string): string {
  return format(parseISO(iso), 'MMM d, yyyy')
}

export function formatDateShort(iso: string): string {
  return format(parseISO(iso), 'MM/dd/yy')
}

export function daysUntil(iso: string): number {
  return differenceInDays(parseISO(iso), new Date())
}

export function isOverdue(iso: string): boolean {
  return isBefore(parseISO(iso), new Date())
}

export function isSoon(iso: string, withinDays = 14): boolean {
  const d = parseISO(iso)
  const now = new Date()
  return isAfter(d, now) && differenceInDays(d, now) <= withinDays
}

export function formatAge(dobIso: string, approximate = false): string {
  const dob = parseISO(dobIso)
  const now = new Date()
  const years = differenceInYears(now, dob)
  if (years >= 1) return `${years}y${approximate ? '~' : ''}`
  const months = differenceInMonths(now, dob)
  if (months >= 1) return `${months}mo${approximate ? '~' : ''}`
  const days = differenceInDays(now, dob)
  return `${days}d${approximate ? '~' : ''}`
}

export function dueDateLabel(iso: string): string {
  const days = daysUntil(iso)
  if (days < 0) return `${Math.abs(days)}d overdue`
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  if (days <= 7) return `Due in ${days}d`
  if (days <= 30) return `Due in ${days}d`
  return `Due ${formatDate(iso)}`
}

export function addDaysToDate(iso: string, days: number): string {
  return addDays(parseISO(iso), days).toISOString().split('T')[0]
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}
