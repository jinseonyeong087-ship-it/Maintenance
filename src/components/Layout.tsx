import type { ReactNode } from 'react'

export type View = 'dashboard' | 'register' | 'list' | 'detail'

interface LayoutProps {
  view: View
  onNavigate: (view: Exclude<View, 'detail'>) => void
  children: ReactNode
}

const links: { id: Exclude<View, 'detail'>; label: string; icon: string }[] = [
  { id: 'dashboard', label: '대시보드', icon: '▦' },
  { id: 'register', label: '계약서 등록', icon: '＋' },
  { id: 'list', label: '업체 목록', icon: '☷' },
]

export default function Layout({ view, onNavigate, children }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 text-left">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-lg font-bold text-white">M</span>
            <span><strong className="block text-sm text-slate-900 sm:text-base">MES Maintenance</strong><span className="block text-[11px] text-slate-500">AI Register</span></span>
          </button>
          <button onClick={() => onNavigate('register')} className="btn-primary hidden sm:inline-flex">＋ 계약서 등록</button>
        </div>
      </header>
      <div className="mx-auto flex max-w-7xl">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-56 shrink-0 border-r border-slate-200 bg-white p-4 md:block">
          <nav className="space-y-1">
            {links.map((link) => <button key={link.id} onClick={() => onNavigate(link.id)} className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-semibold ${view === link.id || (view === 'detail' && link.id === 'list') ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}><span>{link.icon}</span>{link.label}</button>)}
          </nav>
          <p className="mt-8 px-3 text-xs leading-5 text-slate-400">계약서는 AI 추출 후 반드시 내용을 확인하고 저장하세요.</p>
        </aside>
        <main className="min-w-0 flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8">{children}</main>
      </div>
      <nav className="fixed bottom-0 z-20 flex w-full border-t border-slate-200 bg-white md:hidden">
        {links.map((link) => <button key={link.id} onClick={() => onNavigate(link.id)} className={`flex min-h-16 flex-1 flex-col items-center justify-center gap-1 text-xs font-semibold ${view === link.id || (view === 'detail' && link.id === 'list') ? 'text-indigo-600' : 'text-slate-500'}`}><span className="text-lg">{link.icon}</span>{link.label}</button>)}
      </nav>
    </div>
  )
}
