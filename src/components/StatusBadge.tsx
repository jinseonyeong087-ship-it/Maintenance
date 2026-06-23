import type { ContractStatus } from '../types/contract'
import { statusClass, statusLabel } from '../utils/contracts'

export default function StatusBadge({ status }: { status: ContractStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusClass[status]}`}>{statusLabel[status]}</span>
}
