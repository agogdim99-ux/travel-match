# ✈ 어디로 떠날까? — 여행 취향 테스트 2.0

8개 질문에 답하면 29개 나라·지역, 62곳 중에서 **내 취향에 맞는 해외 도시**를 추천하고, **외교부 여행경보**를 함께 보여 주는 웹 서비스예요.

- 기획 문서: [PRD.md](./PRD.md)
- 배포 주소: https://eodiro-travel.vercel.app

## 화면

| 화면 | 주소 | 설명 |
|---|---|---|
| 홈 | `/` | 여행금지 국가·지역, 추천 여행지 중 주의할 곳 |
| 테스트 | `/test` | 닉네임 + 질문 8개 |
| 결과 | `/result/[id]` | 1위 여행지(탑승권 카드), 후보 2곳, 함께 가면 좋은 곳, 메모 |
| 내 기록 | `/my` | 저장한 결과 목록, 메모 수정, 삭제 |

## API (Next.js Route Handlers)

| 방식 | 주소 | 하는 일 |
|---|---|---|
| GET | `/api/destinations` | 여행지 목록 |
| GET | `/api/advisories` | 여행금지 국가·지역 |
| POST | `/api/results` | 추천 계산 + 결과 저장 |
| GET | `/api/results?owner=` | 내 결과 목록 |
| GET | `/api/results/:id` | 결과 하나 |
| PATCH | `/api/results/:id` | 메모 수정 (본인만) |
| DELETE | `/api/results/:id` | 결과 삭제 (본인만) |

## 기술

- **Next.js 15** — 화면 + API 서버
- **Supabase (PostgreSQL)** — 데이터 저장. RLS를 켜고 정책을 두지 않아, 브라우저에서 DB에 직접 닿지 못하고 반드시 API를 거쳐요.
- **Vercel** — 배포

## 내 컴퓨터에서 실행하기

```
npm install
```

`.env.example`을 복사해 `.env.local`을 만들고 Supabase 값을 넣은 뒤:

```
npm run dev
```

브라우저에서 http://localhost:3000 을 열어요.

## DB 준비

Supabase SQL Editor에서 `supabase/schema.sql` → `supabase/seed.sql` 순서로 실행해요.
여행지 데이터를 고치려면 `data/destinations.mjs`를 수정하고 `npm run seed-sql`로 seed.sql을 다시 만들어요.

## 여행경보 안내

여행경보는 참고용이에요. 여행금지 목록은 2026년 7월 9일 외교부 결정(2027년 1월 31일까지)을 기준으로 했어요. 출발 전에는 꼭 [외교부 해외안전여행](https://www.0404.go.kr)에서 최신 정보를 확인하세요.
