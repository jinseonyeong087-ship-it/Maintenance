import type { ChangeEvent } from 'react'
import type { ContractStatus, ExtractionResult, MaintenanceContract } from '../types/contract'

export type FormValue = ExtractionResult & { status: ContractStatus; pdfFileName: string }

interface Props {
  value: FormValue
  onChange: (value: FormValue) => void
  onSubmit: () => void
  submitLabel: string
  onCancel?: () => void
}

const fields: { key: keyof FormValue; label: string; type?: string; wide?: boolean; area?: boolean; placeholder?: string }[] = [
  { key: 'companyName', label: '업체명', placeholder: '업체명을 입력하세요' }, { key: 'businessNumber', label: '사업자등록번호', placeholder: '000-00-00000' },
  { key: 'ceoName', label: '대표자명' }, { key: 'managerName', label: '담당자명' },
  { key: 'managerPhone', label: '담당자 연락처', type: 'tel' }, { key: 'email', label: '이메일', type: 'email' },
  { key: 'address', label: '주소', wide: true }, { key: 'contractStartDate', label: '계약 시작일', type: 'date' },
  { key: 'contractEndDate', label: '계약 종료일', type: 'date' }, { key: 'monthlyFee', label: '월 유지보수 금액', type: 'number', placeholder: '숫자만 입력' },
  { key: 'status', label: '계약 상태' }, { key: 'supportScope', label: '지원 범위', wide: true, area: true },
  { key: 'memo', label: '비고', wide: true, area: true },
]

export function toFormValue(value: Partial<MaintenanceContract | ExtractionResult> = {}): FormValue {
  return { companyName: '', businessNumber: '', ceoName: '', managerName: '', managerPhone: '', email: '', address: '', contractStartDate: '', contractEndDate: '', monthlyFee: 0, supportScope: '', memo: '', rawText: '', status: 'maintenance', pdfFileName: '', ...value }
}

export default function ContractForm({ value, onChange, onSubmit, submitLabel, onCancel }: Props) {
  const set = (key: keyof FormValue, raw: string) => {
    const next = key === 'monthlyFee' ? Number(raw) || 0 : raw
    onChange({ ...value, [key]: next })
  }
  return <form onSubmit={(e) => { e.preventDefault(); onSubmit() }} className="panel p-5 sm:p-6">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-2"><div><h2 className="font-bold text-slate-900">계약 정보 확인</h2><p className="mt-1 text-sm text-slate-500">AI 결과는 참고용입니다. 저장 전에 내용을 확인·수정하세요.</p></div><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">확인 후 저장</span></div>
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((field) => <label key={field.key} className={field.wide ? 'sm:col-span-2' : ''}><span className="label">{field.label}</span>
        {field.key === 'status' ? <select className="input" value={value.status} onChange={(e) => set(field.key, e.target.value)}><option value="maintenance">유지보수중</option><option value="pending">검토중</option><option value="expiring">만료예정</option><option value="expired">계약만료</option></select>
          : field.area ? <textarea className="input min-h-24 resize-y" value={String(value[field.key] ?? '')} onChange={(e) => set(field.key, e.target.value)} placeholder={field.placeholder} />
            : <input className="input" type={field.type ?? 'text'} value={String(value[field.key] ?? '')} onChange={(e: ChangeEvent<HTMLInputElement>) => set(field.key, e.target.value)} placeholder={field.placeholder} />}
      </label>)}
      <div className="sm:col-span-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600"><span className="font-medium">PDF 파일명:</span> {value.pdfFileName || '업로드된 파일 없음'} <span className="ml-4 font-medium">등록일:</span> 저장 시 자동 기록</div>
    </div>
    <div className="mt-6 flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">{onCancel && <button type="button" onClick={onCancel} className="btn-secondary">취소</button>}<button className="btn-primary" type="submit">{submitLabel}</button></div>
  </form>
}
