import type { ContractStatus, MaintenanceContract } from '../types/contract'

export const statusLabel: Record<ContractStatus, string> = {
  maintenance: '유지보수중', expiring: '만료예정', expired: '계약만료', pending: '검토중',
}

export const statusClass: Record<ContractStatus, string> = {
  maintenance: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  expiring: 'bg-amber-50 text-amber-700 ring-amber-200',
  expired: 'bg-rose-50 text-rose-700 ring-rose-200',
  pending: 'bg-slate-100 text-slate-600 ring-slate-200',
}

export function daysUntil(date?: string) {
  if (!date) return null
  const target = new Date(`${date}T00:00:00`)
  if (Number.isNaN(target.getTime())) return null
  return Math.ceil((target.getTime() - new Date().setHours(0, 0, 0, 0)) / 86_400_000)
}

export function ddayText(date?: string) {
  const days = daysUntil(date)
  if (days === null) return '-'
  if (days === 0) return 'D-Day'
  return days > 0 ? `D-${days}` : `D+${Math.abs(days)}`
}

export function derivedStatus(contract: MaintenanceContract): ContractStatus {
  const days = daysUntil(contract.contractEndDate)
  if (days !== null) {
    if (days < 0) return 'expired'
    if (days <= 30) return 'expiring'
  }
  return contract.status
}

export function formatWon(value: number | string) {
  const amount = Number(value) || 0
  return `${new Intl.NumberFormat('ko-KR').format(amount)}원`
}

export function formatDate(value?: string) {
  if (!value) return '-'
  return value.split('-').join('.')
}
