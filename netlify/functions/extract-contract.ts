import type { Handler } from '@netlify/functions'
import OpenAI from 'openai'

const schema = {
  type: 'object',
  additionalProperties: false,
  required: ['companyName', 'businessNumber', 'ceoName', 'managerName', 'managerPhone', 'email', 'address', 'contractStartDate', 'contractEndDate', 'monthlyFee', 'supportScope', 'memo'],
  properties: {
    companyName: { type: 'string' }, businessNumber: { type: 'string' }, ceoName: { type: 'string' }, managerName: { type: 'string' }, managerPhone: { type: 'string' }, email: { type: 'string' }, address: { type: 'string' }, contractStartDate: { type: 'string' }, contractEndDate: { type: 'string' }, monthlyFee: { type: 'number' }, supportScope: { type: 'string' }, memo: { type: 'string' },
  },
} as const

const json = (statusCode: number, body: unknown) => ({ statusCode, headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify(body) })

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'POST 요청만 허용됩니다.' })
  if (!process.env.OPENAI_API_KEY) return json(500, { error: 'OPENAI_API_KEY가 Netlify 환경 변수에 설정되지 않았습니다. 직접 입력 후 저장할 수 있습니다.' })
  try {
    const payload = JSON.parse(event.body || '{}') as { images?: unknown; fileName?: string }
    if (!Array.isArray(payload.images) || payload.images.length === 0 || payload.images.length > 4 || !payload.images.every((image) => typeof image === 'string' && image.startsWith('data:image/'))) return json(400, { error: 'PDF에서 변환된 이미지(최대 4장)가 필요합니다.' })
    if (payload.images.some((image) => image.length > 7_000_000)) return json(413, { error: '변환된 이미지 크기가 너무 큽니다. 더 작은 PDF를 사용해 주세요.' })
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      input: [{
        role: 'user',
        content: [
          { type: 'input_text', text: `첨부된 ${payload.fileName || '유지보수 계약서'} 이미지를 분석해 계약 정보를 추출하세요. 누락된 값은 빈 문자열, 금액을 찾을 수 없으면 0으로 넣으세요. 금액은 원 단위 숫자만 넣고, 날짜는 YYYY-MM-DD 형식으로 정규화하세요. 담당자 연락처는 계약 담당자 연락처를 우선합니다. 지원 범위와 특이사항은 짧고 정확하게 요약하세요.` },
          ...payload.images.map((image) => ({ type: 'input_image' as const, image_url: image, detail: 'high' as const })),
        ],
      }],
      text: { format: { type: 'json_schema', name: 'maintenance_contract', strict: true, schema } },
    })
    const extracted = JSON.parse(response.output_text) as Record<string, unknown>
    return json(200, { ...extracted, rawText: response.output_text })
  } catch (error) {
    console.error('Contract extraction failed:', error)
    const message = error instanceof Error ? error.message : '알 수 없는 오류'
    return json(500, { error: `AI 추출에 실패했습니다: ${message}` })
  }
}
