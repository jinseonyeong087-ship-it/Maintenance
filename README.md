# MES Maintenance AI Register

MES 유지보수 계약서 PDF를 업로드하면 AI가 계약 정보를 읽어 등록 폼을 자동으로 채우는 반응형 관리 웹앱입니다. 계약 정보는 브라우저의 `localStorage`에 저장되며, 저장 전 사용자가 AI 결과를 확인하고 수정할 수 있습니다.

## 주요 기능

- 대시보드: 전체/유지보수중/만료예정/계약만료 현황, 최근 업체 5개
- PDF 계약서 업로드와 브라우저 내 미리보기
- PDF 페이지(최대 4장)를 이미지로 변환한 뒤 Netlify Function을 통해 AI 분석
- AI 추출값 자동 입력, 추출 JSON 원문 확인, 실패 시 수동 입력
- 계약 등록·상세 조회·수정·삭제와 새로고침 후 데이터 유지
- 업체명/담당자/사업자번호 검색, 계약 상태 필터, D-day
- 데스크톱 테이블 및 모바일 카드형 목록

## 기술 구성

- React + TypeScript + Vite + Tailwind CSS
- `pdfjs-dist`: PDF 페이지를 브라우저에서 JPEG 이미지로 변환
- Netlify Functions: OpenAI API 키를 브라우저에 노출하지 않는 서버리스 중계
- OpenAI Responses API + JSON Schema: 일관된 JSON 추출 결과
- `localStorage`: 별도 DB 없는 계약 정보 저장

## 로컬 실행

```bash
npm install
copy .env.example .env
```

`.env`에 실제 API 키를 입력합니다. 이 파일은 `.gitignore`에 포함되어 커밋되지 않습니다.

```env
OPENAI_API_KEY=실제_API_키
# 선택: 이미지 입력을 지원하는 모델로 바꿀 수 있습니다.
OPENAI_MODEL=gpt-4.1-mini
```

Netlify Function까지 함께 실행하려면 Netlify CLI를 사용합니다.

```bash
npx netlify dev
```

프론트엔드만 확인할 때는 `npm run dev`를 실행할 수 있습니다. 이 경우 AI 추출 엔드포인트는 동작하지 않지만, 수동으로 계약을 등록하고 목록 기능을 확인할 수 있습니다.

## Netlify 배포

1. 이 폴더를 GitHub 저장소로 올립니다. `.env`는 절대 올리지 않습니다.
2. Netlify에서 **Add new site → Import an existing project**를 선택하고 GitHub 저장소를 연결합니다.
3. 빌드 설정은 `netlify.toml`이 자동 적용합니다. (`npm run build`, publish `dist`, functions `netlify/functions`)
4. Netlify 사이트의 **Site configuration → Environment variables**에 아래 환경 변수를 추가합니다.

   - `OPENAI_API_KEY`: 실제 OpenAI API 키 (필수)
   - `OPENAI_MODEL`: 사용할 이미지 입력 지원 모델 (선택, 기본값 `gpt-4.1-mini`)

5. Deploy site를 실행합니다. 이후 `/.netlify/functions/extract-contract`는 Netlify Function에서만 키를 읽어 OpenAI API를 호출합니다.

## 데이터 및 유의사항

- 샘플 업체 5개가 최초 실행 시 자동 생성됩니다.
- 계약 정보와 PDF 파일명만 `localStorage`에 저장합니다. PDF 원본은 저장/업로드하지 않습니다.
- AI가 분석하는 이미지는 추출 요청에만 사용됩니다. 결과는 틀릴 수 있으므로 저장 전 필수 정보를 확인하세요.
- 브라우저 저장소를 지우거나 다른 기기에서 접속하면 로컬 계약 데이터는 공유되지 않습니다. 실서비스에서 공동 관리를 원하면 DB와 인증을 추가해야 합니다.


