## https://rhyme11.netlify.app/

React + TypeScript + Vite 기반 웹앱을 만들어줘.

프로젝트명:
MES Maintenance AI Register

목표:
MES 유지보수 계약서 PDF를 업로드하면 AI가 계약 정보를 추출하고, 추출된 내용을 등록 폼에 자동 입력해주는 웹앱을 만든다.
등록 후에는 유지보수 업체 목록에 표시되고, 상세 조회/수정/삭제가 가능해야 한다.
GitHub에 올리고 Netlify에 배포할 수 있어야 한다.
PC와 모바일에서 모두 보기 쉬운 반응형 웹앱으로 만든다.

중요:
- OpenAI API 키는 프론트엔드에 직접 넣지 않는다.
- Netlify Functions를 사용해서 서버리스 API를 만든다.
- 프론트엔드는 Netlify Function을 호출하고, Netlify Function에서 OpenAI API를 호출한다.
- OpenAI API는 이미지/PDF 분석이 가능한 모델을 사용한다.
- 추출 결과는 JSON 형태로 받는다.
- AI 추출 결과는 바로 저장하지 않고, 사용자가 확인 후 저장하게 한다.

기술 스택:
- React
- TypeScript
- Vite
- Tailwind CSS
- Netlify
- Netlify Functions
- localStorage
- OpenAI API
- pdf.js 또는 브라우저에서 PDF 페이지를 이미지로 변환할 수 있는 방식

주요 화면:

1. 대시보드
- 전체 업체 수
- 유지보수중 업체 수
- 만료예정 업체 수
- 계약만료 업체 수
- 최근 등록 업체 5개 표시

2. 계약서 등록 화면
- PDF 업로드 영역
- 업로드한 PDF 파일명 표시
- PDF 미리보기
- "AI 추출" 버튼
- 추출 진행 상태 표시
- OCR/AI 추출 결과 원문 텍스트 표시
- 등록 폼 표시

등록 폼 필드:
- 업체명
- 사업자등록번호
- 대표자명
- 담당자명
- 담당자 연락처
- 이메일
- 주소
- 계약 시작일
- 계약 종료일
- 월 유지보수 금액
- 지원 범위
- 계약 상태
- 비고
- PDF 파일명
- 등록일

3. 유지보수 업체 목록 화면
- 업체명 검색
- 상태 필터
- 계약만료 D-day 표시
- 업체명
- 담당자
- 연락처
- 계약기간
- 월 유지보수 금액
- 상태
- 상세/수정/삭제 버튼

4. 상세 화면
- 등록된 업체 정보 표시
- 계약서 파일명 표시
- 계약 만료 D-day 표시
- 업무일지 문구 자동 생성
  예: "금성정공 유지보수 계약정보 등록 완료 / 계약기간 2026-01-01 ~ 2026-12-31"

AI 추출 요구사항:
- 스캔본 PDF도 고려한다.
- PDF 페이지를 이미지로 변환한 뒤 AI API에 전달한다.
- AI는 계약서 이미지에서 아래 정보를 추출한다.
  - 업체명
  - 사업자등록번호
  - 대표자명
  - 담당자명
  - 연락처
  - 이메일
  - 주소
  - 계약 시작일
  - 계약 종료일
  - 월 유지보수 금액
  - 지원 범위
  - 특이사항/비고
- 누락된 값은 빈 문자열로 둔다.
- 금액은 숫자로 정리한다.
- 날짜는 YYYY-MM-DD 형식으로 정리한다.

AI 응답 JSON 예시:
{
  "companyName": "",
  "businessNumber": "",
  "ceoName": "",
  "managerName": "",
  "managerPhone": "",
  "email": "",
  "address": "",
  "contractStartDate": "",
  "contractEndDate": "",
  "monthlyFee": 0,
  "supportScope": "",
  "memo": ""
}

데이터 저장:
- 백엔드 DB 없이 localStorage에 저장한다.
- 등록/수정/삭제 가능하게 한다.
- 새로고침해도 데이터가 유지되어야 한다.
- 샘플 데이터 5개를 기본으로 넣는다.

반응형 요구사항:
- 모바일에서도 사용하기 쉽게 만든다.
- 모바일에서는 카드형 목록으로 보이게 한다.
- PC에서는 테이블형 목록으로 보이게 한다.
- 버튼과 입력창은 터치하기 쉽게 크기를 확보한다.

디자인:
- 업무용 관리자 화면 느낌
- 깔끔한 흰색/회색 기반
- 카드형 대시보드
- 명확한 버튼 색상
- 등록/목록/상세 이동이 쉬운 구조

폴더 구조:
- src/components
- src/pages
- src/types
- src/utils
- netlify/functions

필수 구현:
- PDF 업로드 UI
- AI 추출 버튼
- Netlify Function API
- 등록 폼 자동 채움
- localStorage 저장
- 목록 조회
- 상세 조회
- 수정
- 삭제
- 검색
- 상태 필터
- 모바일 반응형
- README.md 작성
- Netlify 배포 방법 작성
- .env.example 작성

주의:
- 실제 OpenAI API 키는 .env에 넣고 GitHub에 올리지 않는다.
- .env 파일은 .gitignore에 포함한다.
- .env.example에는 변수명만 작성한다.
- AI 추출 실패 시 사용자가 직접 입력할 수 있어야 한다.
- AI 결과가 틀릴 수 있으므로 저장 전 확인 문구를 표시한다.