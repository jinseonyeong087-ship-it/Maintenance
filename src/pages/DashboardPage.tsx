import type { MaintenanceContract } from '../types/contract'
import { derivedStatus, ddayText, formatDate, formatWon } from '../utils/contracts'
import StatusBadge from '../components/StatusBadge'

interface Props { contracts: MaintenanceContract[]; onNavigateList: () => void; onOpen: (id: string) => void; onRegister: () => void }

export default function DashboardPage({ contracts, onNavigateList, onOpen, onRegister }: Props) {
  const active = contracts.filter((item) => derivedStatus(item) === 'maintenance').length
  const expiring = contracts.filter((item) => derivedStatus(item) === 'expiring').length
  const expired = contracts.filter((item) => derivedStatus(item) === 'expired').length
  const cards = [
    ['전체 업체 수', `${contracts.length}`, '등록된 유지보수 업체'], ['유지보수중', `${active}`, '정상 진행 계약'],
    ['만료예정', `${expiring}`, '30일 이내 만료'], ['계약만료', `${expired}`, '만료 계약 확인 필요'],
  ]
  const latest = [...contracts].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5)
  return <div className="mx-auto max-w-6xl space-y-6">
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-indigo-600">MES MAINTENANCE</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">계약 관리 대시보드</h1><p className="mt-2 text-sm text-slate-500">유지보수 계약 현황과 만료 일정을 한눈에 확인하세요.</p></div><button onClick={onRegister} className="btn-primary">＋ 새 계약서 등록</button></section>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, count, description], index) => <div className="panel p-5" key={label}><p className="text-sm font-medium text-slate-500">{label}</p><div className={`mt-3 text-3xl font-bold ${index === 2 ? 'text-amber-600' : index === 3 ? 'text-rose-600' : 'text-slate-900'}`}>{count}</div><p className="mt-2 text-xs text-slate-400">{description}</p></div>)}</section>
    <section className="panel overflow-hidden"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-bold text-slate-900">최근 등록 업체</h2><p className="mt-1 text-sm text-slate-500">최근 추가되거나 수정된 계약 정보입니다.</p></div><button className="text-sm font-semibold text-indigo-600 hover:text-indigo-800" onClick={onNavigateList}>전체 보기 →</button></div>
      <div className="divide-y divide-slate-100">{latest.map((contract) => { const status = derivedStatus(contract); return <button onClick={() => onOpen(contract.id)} key={contract.id} className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-slate-50"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-700">{contract.companyName.slice(0, 1)}</div><div className="min-w-0 flex-1"><p className="truncate font-semibold text-slate-800">{contract.companyName}</p><p className="mt-0.5 text-xs text-slate-500">{contract.managerName || '담당자 미입력'} · {formatDate(contract.contractStartDate)} ~ {formatDate(contract.contractEndDate)}</p></div><div className="hidden text-right sm:block"><p className="text-sm font-semibold text-slate-700">{formatWon(contract.monthlyFee)}</p><p className="mt-1 text-xs text-slate-500">{ddayText(contract.contractEndDate)}</p></div><StatusBadge status={status} /></button>})}</div>
    </section>
  </div>
}
