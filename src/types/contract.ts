export type ContractStatus = 'maintenance' | 'expiring' | 'expired' | 'pending'

export interface ExtractionResult {
  companyName: string
  businessNumber: string
  ceoName: string
  managerName: string
  managerPhone: string
  email: string
  address: string
  contractStartDate: string
  contractEndDate: string
  monthlyFee: number
  supportScope: string
  memo: string
  rawText?: string
}

export interface MaintenanceContract extends ExtractionResult {
  id: string
  status: ContractStatus
  pdfFileName: string
  createdAt: string
  updatedAt: string
}

export const emptyExtraction: ExtractionResult = {
  companyName: '', businessNumber: '', ceoName: '', managerName: '', managerPhone: '',
  email: '', address: '', contractStartDate: '', contractEndDate: '', monthlyFee: 0,
  supportScope: '', memo: '', rawText: '',
}
