import { useEffect, useMemo, useState } from 'react'
import Layout, { type View } from './components/Layout'
import type { MaintenanceContract } from './types/contract'
import { loadContracts, saveContracts } from './utils/storage'
import type { FormValue } from './components/ContractForm'
import DashboardPage from './pages/DashboardPage'
import RegisterPage from './pages/RegisterPage'
import ContractListPage from './pages/ContractListPage'
import ContractDetailPage from './pages/ContractDetailPage'

export default function App() {
  const [contracts, setContracts] = useState<MaintenanceContract[]>(loadContracts)
  const [view, setView] = useState<View>('dashboard')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  useEffect(() => saveContracts(contracts), [contracts])
  const selected = useMemo(() => contracts.find((item) => item.id === selectedId), [contracts, selectedId])
  const editing = useMemo(() => contracts.find((item) => item.id === editingId), [contracts, editingId])
  const navigate = (next: Exclude<View, 'detail'>) => { setView(next); setSelectedId(null); setEditingId(null) }
  const open = (id: string) => { setSelectedId(id); setEditingId(null); setView('detail') }
  const edit = (id: string) => { setEditingId(id); setSelectedId(null); setView('register') }
  const save = (form: FormValue) => {
    const now = new Date().toISOString()
    if (editingId) {
      setContracts((items) => items.map((item) => item.id === editingId ? { ...item, ...form, updatedAt: now } : item))
      setSelectedId(editingId); setEditingId(null); setView('detail')
    } else {
      const item: MaintenanceContract = { ...form, id: crypto.randomUUID(), createdAt: now, updatedAt: now }
      setContracts((items) => [item, ...items]); setSelectedId(item.id); setView('detail')
    }
  }
  const remove = (id: string) => { setContracts((items) => items.filter((item) => item.id !== id)); navigate('list') }
  return <Layout view={view} onNavigate={navigate}>{view === 'dashboard' && <DashboardPage contracts={contracts} onNavigateList={() => navigate('list')} onOpen={open} onRegister={() => navigate('register')} />}{view === 'list' && <ContractListPage contracts={contracts} onOpen={open} onEdit={edit} onDelete={remove} onRegister={() => navigate('register')} />}{view === 'register' && <RegisterPage editing={editing} onSave={save} onCancel={() => navigate(editing ? 'list' : 'dashboard')} />}{view === 'detail' && selected && <ContractDetailPage contract={selected} onBack={() => navigate('list')} onEdit={() => edit(selected.id)} onDelete={() => { if (window.confirm(`“${selected.companyName}” 계약 정보를 삭제할까요?`)) remove(selected.id) }} />}</Layout>
}
