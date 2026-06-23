import { useEffect, useRef, useState } from 'react'
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import ContractForm, { toFormValue, type FormValue } from '../components/ContractForm'
import type { ExtractionResult, MaintenanceContract } from '../types/contract'

GlobalWorkerOptions.workerSrc = workerSrc

interface Props { editing?: MaintenanceContract; onSave: (form: FormValue) => void; onCancel: () => void }
type Progress = 'idle' | 'converting' | 'extracting' | 'failed'

async function pdfToImages(file: File) {
  const data = await file.arrayBuffer()
  const pdf = await getDocument({ data }).promise
  const pages: string[] = []
  for (let pageNo = 1; pageNo <= Math.min(pdf.numPages, 4); pageNo += 1) {
    const page = await pdf.getPage(pageNo)
    const viewport = page.getViewport({ scale: 1.45 })
    const canvas = document.createElement('canvas')
    canvas.width = Math.floor(viewport.width)
    canvas.height = Math.floor(viewport.height)
    const context = canvas.getContext('2d')
    if (!context) throw new Error('PDF 캔버스를 생성하지 못했습니다.')
    await page.render({ canvasContext: context, viewport }).promise
    pages.push(canvas.toDataURL('image/jpeg', 0.82))
  }
  return pages
}

export default function RegisterPage({ editing, onSave, onCancel }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [form, setForm] = useState<FormValue>(() => toFormValue(editing))
  const [progress, setProgress] = useState<Progress>('idle')
  const [error, setError] = useState('')
  const [rawText, setRawText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) setForm(toFormValue(editing))
  }, [editing])
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }, [previewUrl])

  const chooseFile = (selected?: File) => {
    if (!selected) return
    if (selected.type !== 'application/pdf') { setError('PDF 파일만 업로드할 수 있습니다.'); return }
    if (selected.size > 15 * 1024 * 1024) { setError('PDF 파일은 15MB 이하로 업로드해 주세요.'); return }
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(selected); setPreviewUrl(URL.createObjectURL(selected)); setForm((old) => ({ ...old, pdfFileName: selected.name })); setError(''); setRawText(''); setProgress('idle')
  }

  const extract = async () => {
    if (!file) { setError('먼저 계약서 PDF를 업로드해 주세요.'); return }
    try {
      setError(''); setProgress('converting')
      const images = await pdfToImages(file)
      setProgress('extracting')
      const response = await fetch('/.netlify/functions/extract-contract', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ images, fileName: file.name }) })
      const body = await response.json() as ExtractionResult & { error?: string }
      if (!response.ok) throw new Error(body.error || 'AI 추출 요청에 실패했습니다.')
      const { rawText: extractedRawText = '', ...extracted } = body
      setForm((old) => ({ ...old, ...extracted, pdfFileName: file.name }))
      setRawText(extractedRawText)
      setProgress('idle')
    } catch (err) {
      setProgress('failed')
      setError(err instanceof Error ? err.message : 'AI 추출 중 오류가 발생했습니다. 직접 정보를 입력해 저장할 수 있습니다.')
    }
  }

  const title = editing ? '계약 정보 수정' : '계약서 등록'
  return <div className="mx-auto max-w-6xl space-y-5"><section><p className="text-sm font-semibold text-indigo-600">{editing ? 'EDIT CONTRACT' : 'AI CONTRACT IMPORT'}</p><h1 className="mt-1 text-2xl font-bold text-slate-900">{title}</h1><p className="mt-2 text-sm text-slate-500">PDF를 업로드하면 AI가 계약 정보를 추출해 등록 폼을 채웁니다.</p></section>
    {!editing && <section className="panel p-5 sm:p-6"><div className="flex flex-col gap-5 lg:flex-row"><div className="lg:w-5/12"><h2 className="font-bold text-slate-900">1. 계약서 PDF 업로드</h2><p className="mt-1 text-sm text-slate-500">스캔된 계약서도 이미지 분석으로 처리합니다. 최대 4페이지를 분석합니다.</p><input ref={inputRef} className="hidden" type="file" accept="application/pdf" onChange={(e) => chooseFile(e.target.files?.[0])} />
        <button type="button" onClick={() => inputRef.current?.click()} className="mt-4 flex min-h-36 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 text-center hover:border-indigo-400 hover:bg-indigo-50"><span className="text-3xl text-indigo-500">⇧</span><span className="mt-2 font-semibold text-slate-700">PDF 파일 선택</span><span className="mt-1 text-xs text-slate-500">클릭하여 계약서를 업로드하세요</span></button>
        {file && <div className="mt-3 flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800"><span className="truncate">✓ {file.name}</span><button className="ml-2 text-xs font-semibold underline" onClick={() => { setFile(null); setPreviewUrl(''); setForm(toFormValue()) }}>제거</button></div>}
        <button type="button" onClick={extract} disabled={!file || progress === 'converting' || progress === 'extracting'} className="btn-primary mt-4 w-full">{progress === 'converting' ? 'PDF 페이지 변환 중…' : progress === 'extracting' ? 'AI가 계약 정보를 읽는 중…' : '✦ AI 추출하기'}</button>
        {error && <div className="mt-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
      </div><div className="min-w-0 flex-1"><h2 className="font-bold text-slate-900">PDF 미리보기</h2><div className="mt-3 h-72 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 sm:h-96">{previewUrl ? <iframe title="계약서 미리보기" src={previewUrl} className="h-full w-full" /> : <div className="grid h-full place-items-center text-sm text-slate-400">업로드한 계약서가 여기에 표시됩니다.</div>}</div></div></div>
      {rawText && <details className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4"><summary className="cursor-pointer text-sm font-semibold text-slate-700">AI 추출 결과 원문 보기</summary><pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap text-xs leading-5 text-slate-600">{rawText}</pre></details>}
    </section>}
    {editing && <section className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">수정 중인 계약의 PDF 파일: <strong>{editing.pdfFileName || '등록된 파일 없음'}</strong></section>}
    <ContractForm value={form} onChange={setForm} onSubmit={() => onSave(form)} submitLabel={editing ? '변경사항 저장' : '계약 정보 저장'} onCancel={onCancel} />
  </div>
}
