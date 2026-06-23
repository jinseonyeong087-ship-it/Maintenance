import type { MaintenanceContract } from '../types/contract'

const KEY = 'mes-maintenance-contracts-v1'
const now = new Date().toISOString()

const samples: MaintenanceContract[] = [
  { id: 'sample-1', companyName: '금성정공', businessNumber: '123-45-67890', ceoName: '김금성', managerName: '이민호', managerPhone: '010-2345-6789', email: 'minho@geumseong.co.kr', address: '경기도 시흥시 산업로 120', contractStartDate: '2026-01-01', contractEndDate: '2026-12-31', monthlyFee: 1500000, supportScope: 'MES 운영 지원, 장애 대응, 월 정기점검', memo: '평일 09:00~18:00 원격 지원', status: 'maintenance', pdfFileName: '금성정공_MES_유지보수계약서.pdf', createdAt: now, updatedAt: now },
  { id: 'sample-2', companyName: '동아모터스', businessNumber: '234-56-78901', ceoName: '박동아', managerName: '최서연', managerPhone: '010-3456-7890', email: 'sy.choi@donga.co.kr', address: '인천광역시 남동구 앵고개로 234', contractStartDate: '2025-07-01', contractEndDate: '2026-07-15', monthlyFee: 2200000, supportScope: 'MES 기능 개선 및 현장 방문 지원', memo: '분기별 방문 점검 포함', status: 'maintenance', pdfFileName: '동아모터스_계약서.pdf', createdAt: now, updatedAt: now },
  { id: 'sample-3', companyName: '한빛전자', businessNumber: '345-67-89012', ceoName: '윤한빛', managerName: '정우진', managerPhone: '010-4567-8901', email: 'woojin@hanbit.co.kr', address: '서울특별시 금천구 디지털로 310', contractStartDate: '2025-08-01', contractEndDate: '2026-06-28', monthlyFee: 1800000, supportScope: '생산·재고 모듈 유지보수', memo: '갱신 견적 협의 필요', status: 'maintenance', pdfFileName: '한빛전자_MES계약.pdf', createdAt: now, updatedAt: now },
  { id: 'sample-4', companyName: '세림화학', businessNumber: '456-78-90123', ceoName: '오세림', managerName: '김다은', managerPhone: '010-5678-9012', email: 'daeun@serimchem.com', address: '충청남도 천안시 서북구 백석공단1로 72', contractStartDate: '2024-05-01', contractEndDate: '2025-04-30', monthlyFee: 1200000, supportScope: '기존 MES 시스템 유지보수', memo: '계약 종료, 재계약 검토 중', status: 'expired', pdfFileName: '세림화학_유지보수계약.pdf', createdAt: now, updatedAt: now },
  { id: 'sample-5', companyName: '미래테크', businessNumber: '567-89-01234', ceoName: '송미래', managerName: '홍지수', managerPhone: '010-6789-0123', email: 'jisoo@miraetech.io', address: '대전광역시 유성구 테크노2로 85', contractStartDate: '2026-03-01', contractEndDate: '2027-02-28', monthlyFee: 3000000, supportScope: '24시간 장애 대응, MES 고도화 컨설팅', memo: 'SLA 별도 첨부', status: 'maintenance', pdfFileName: '미래테크_계약서.pdf', createdAt: now, updatedAt: now },
]

export function loadContracts() {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved) return JSON.parse(saved) as MaintenanceContract[]
  } catch { /* defaults below */ }
  localStorage.setItem(KEY, JSON.stringify(samples))
  return samples
}

export function saveContracts(contracts: MaintenanceContract[]) {
  localStorage.setItem(KEY, JSON.stringify(contracts))
}
