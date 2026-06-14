# 01. 현재 프로젝트 상태

이 문서는 **AI 운동 기록 인증 게시판**의 현재 구현 상태를 고정해두는 문서다.

Codex는 새 작업을 시작하기 전에 이 문서를 읽고, 이미 동작하는 구조를 함부로 바꾸지 않아야 한다.

---

## 1. 프로젝트 한 줄 요약

이 프로젝트는 사용자가 운동 기록을 게시글처럼 남기고, AI가 이전 운동 기록을 참고해서 다음 운동 목표를 추천해주는 웹 서비스다.

핵심 주제는 다음과 같다.

```text
운동 기록 기반 점진적 과부하 보조
```

의학 조언이나 부상 진단 서비스가 아니다. 운동 초보자가 꾸준히 기록하고 성장감을 느끼도록 돕는 게시판형 서비스다.

---

## 2. 현재 큰 구조

일반 게시판 기능은 다음 흐름으로 동작한다.

```text
React
-> NestJS Backend
-> PostgreSQL
```

AI 서버 관련 기본 구조는 존재한다.

```text
FastAPI /health
FastAPI /analysis/demo
NestJS backend/src/ai/*
```

하지만 현재 코드 기준으로 아래 전체 연결은 아직 미완료 상태다.

```text
React 상세 화면
-> NestJS POST /posts/:id/analyze
-> NestJS가 현재 게시글과 이전 기록 조회
-> NestJS가 FastAPI /analysis/demo 호출
-> FastAPI가 분석 결과 반환
-> NestJS가 React로 반환
-> React가 화면에 표시
```

중요한 원칙:

```text
React는 FastAPI를 직접 호출하지 않는다.
AI 분석 요청은 반드시 NestJS를 거쳐야 한다.
```

---

## 3. 기술 스택

| 영역 | 기술 | 현재 역할 |
|---|---|---|
| Frontend | React, Vite, TypeScript, React Router | 화면 구성, API 호출 |
| Backend | NestJS, TypeScript, Prisma ORM | 인증, 게시글 API, DB 접근, AI 서버 호출 |
| Database | PostgreSQL | 사용자, 게시글, 운동 기록 저장 |
| Auth | JWT, bcrypt | 로그인 인증, 비밀번호 해싱 |
| AI Server | FastAPI, Python, Pydantic BaseModel | demo 분석 결과 생성 |
| Infra | Docker Compose | 로컬 PostgreSQL 컨테이너 실행 |

---

## 4. 완료된 기능

### 프로젝트 기반

- 프로젝트 폴더 구조 정리
- Docker Compose 기반 PostgreSQL
- Prisma schema 작성
- Prisma migration
- NestJS 기본 서버
- PrismaModule / PrismaService
- FastAPI 기본 구조

### 인증

- 회원가입
- 로그인
- bcrypt 비밀번호 해싱
- JWT 발급
- JWT Guard
- `GET /auth/me`
- React 회원가입 화면
- React 로그인 화면
- accessToken localStorage 저장

### 게시글 / 운동 기록

- 게시글 작성
- 게시글 목록
- 게시글 상세
- 게시글 수정
- 게시글 삭제
- 작성자만 수정/삭제 가능
- 제목/운동명 검색
- React 게시글 목록
- React 게시글 작성
- React 게시글 상세

### AI 분석

- FastAPI `/health`
- FastAPI `/analysis/demo`
- NestJS `AiService`

아직 미완료인 AI 연결:

- NestJS `POST /posts/:id/analyze`
- 게시글 상세 화면의 AI 분석 버튼
- AI 분석 결과 화면 표시

---

## 5. 최근 검증 완료 상태

최근 검증 결과는 다음과 같다.

```text
backend npm run build 통과
frontend npm run build 통과
FastAPI Python 문법 확인 통과
```

아직 현재 코드 기준으로 완료되었다고 말하면 안 되는 통합 흐름:

```text
AI 서버 health OK
백엔드 health OK
회원가입 OK
로그인 OK
게시글 작성 OK
POST /posts/:id/analyze OK
AI 분석 결과 응답 OK
```

위 흐름은 다음 작업에서 다시 연결하고 검증해야 하는 목표다.

Codex는 새 기능을 구현한 뒤 기존 게시판/인증 기준선이 깨지지 않았는지 확인해야 한다.

---

## 6. 현재 DB 모델 요약

Prisma schema 기준 주요 모델은 다음과 같다.

```text
User
  id
  email
  nickname
  passwordHash
  posts

Post
  id
  authorId
  title
  date
  bodyPart
  memo
  author
  exercises

Exercise
  id
  postId
  exerciseName
  normalizedName
  weightKg
  targetReps
  orderIndex
  memo
  sets

ExerciseSet
  id
  exerciseId
  setNumber
  reps
  perceivedDifficulty
```

운동 기록 구조는 다음과 같다.

```text
Post
  -> Exercise[]
      -> ExerciseSet[]
```

이 구조는 “게시글 하나 안에 여러 운동이 있고, 운동 하나 안에 여러 세트가 있다”는 현실적인 기록 방식과 맞다.

---

## 7. 현재 API 요약

### Auth API

```text
POST /auth/signup
POST /auth/login
GET /auth/me
```

로그인 성공 시 `accessToken`을 반환한다.

프론트는 보호 API 호출 시 다음 헤더를 보낸다.

```text
Authorization: Bearer accessToken
```

---

### Posts API

```text
POST /posts
GET /posts
GET /posts?keyword=벤치프레스
GET /posts/:id
PATCH /posts/:id
DELETE /posts/:id
```

보호 API:

```text
POST /posts
PATCH /posts/:id
DELETE /posts/:id
```

공개 API:

```text
GET /posts
GET /posts/:id
```

---

## 8. 현재 AI 분석 흐름

현재 AI 분석은 GPT를 직접 호출하지 않는다.

FastAPI에서 임시 분석 결과를 만드는 `/analysis/demo`는 존재한다.

하지만 React 상세 화면에서 버튼을 눌러 NestJS를 거쳐 FastAPI까지 호출하는 전체 흐름은 아직 미완료 상태다.

목표 흐름:

```text
1. React 상세 화면에서 AI 분석 버튼 클릭
2. React가 NestJS POST /posts/:id/analyze 호출
3. JwtAuthGuard가 accessToken 검사
4. PostsService가 현재 게시글 조회
5. 작성자 검사
6. 현재 게시글의 운동명 목록 추출
7. 같은 운동명을 가진 이전 게시글 최대 3개 조회
8. 현재 기록과 이전 기록을 FastAPI로 전송
9. FastAPI가 summary, recommendation, nextGoal 반환
10. React가 결과 표시
```

FastAPI demo 응답 예시:

```json
{
  "summary": "AI 분석 테스트 가슴 운동 기록입니다. 벤치프레스 세트 기록은 8/8/7회입니다.",
  "recommendation": "아직 비교할 이전 기록이 부족합니다. 오늘 기록을 기준점으로 저장해두고 다음 운동 때 같은 조건으로 한 번 더 기록해보세요.",
  "nextGoal": "다음 운동에서는 벤치프레스의 목표 반복 수를 안정적으로 채우는 것을 우선하세요.",
  "referencedPostCount": 0
}
```

---

## 9. 중요한 파일 위치

### Backend

```text
backend/src/app.module.ts
backend/src/prisma/prisma.module.ts
backend/src/prisma/prisma.service.ts

backend/src/auth/auth.module.ts
backend/src/auth/auth.controller.ts
backend/src/auth/auth.service.ts
backend/src/auth/jwt-auth.guard.ts
backend/src/auth/dto/signup.dto.ts
backend/src/auth/dto/login.dto.ts

backend/src/posts/posts.module.ts
backend/src/posts/posts.controller.ts
backend/src/posts/posts.service.ts
backend/src/posts/dto/create-post.dto.ts
backend/src/posts/dto/create-exercise.dto.ts
backend/src/posts/dto/create-set.dto.ts
backend/src/posts/dto/update-post.dto.ts

backend/src/ai/ai.module.ts
backend/src/ai/ai.service.ts
backend/src/ai/types.ts
```

### Frontend

```text
frontend/src/api/client.ts
frontend/src/api/auth.ts
frontend/src/api/posts.ts

frontend/src/types/auth.ts
frontend/src/types/post.ts

frontend/src/pages/SignupPage.tsx
frontend/src/pages/LoginPage.tsx
frontend/src/pages/PostListPage.tsx
frontend/src/pages/PostCreatePage.tsx
frontend/src/pages/PostDetailPage.tsx
```

### AI Server

```text
ai-server/app/main.py
ai-server/app/routers/analysis.py
ai-server/app/schemas/analysis.py
ai-server/app/services/analysis_service.py
```

### Existing Docs

```text
docs/구현로드맵.md
docs/운동기록기획.md
docs/운동기록명세.md
docs/2026-06-13/토요일_AI서버분석_학습문서.md
```

---

## 10. 아직 demo 수준인 부분

다음은 아직 완성형 구현이라고 말하면 안 된다.

### AI 분석

현재 FastAPI는 GPT를 직접 호출하지 않는다.

따라서 현재 상태는 다음과 같이 표현한다.

```text
FastAPI demo 분석 API와 NestJS AiService 기본 구조는 있지만,
게시글 상세 화면에서 AI 분석 버튼을 눌러 전체 흐름을 실행하는 연결은 아직 미완료다.
```

---

### RAG

현재는 이전 기록을 조회해 FastAPI로 보내는 전체 API 흐름이 아직 연결되지 않았다.

다음 작업에서 아래 구조를 최소 구현 목표로 삼는다.

```text
로그인한 사용자 + 같은 운동명 + 최근 기록 N개를 AI 분석 재료로 사용하는 구조화 검색 기반 RAG 흐름을 설계한다.
```

pgvector는 아직 필수 구현이 아니다.

---

### MCP

현재 MCP 서버가 완성되어 있다고 말하면 안 된다.

현실적인 후보는 다음이다.

```text
운동명 정규화 tool
```

예:

```text
bench press
벤치
벤치프레스
-> 벤치프레스
```

---

### Agent workflow

완전 자율 에이전트가 아니다.

현재 발표 가능한 표현은 다음이다.

```text
현재 게시글 조회 -> 운동명 정규화 -> 이전 기록 검색 -> AI 분석 요청 -> 다음 운동 목표 추천 -> 결과 반환이라는 정해진 workflow로 설계했다.
```

---

## 11. 다음 확장 포인트

우선순위는 다음과 같다.

```text
1. 게시글 AI 분석 연결 재구현
2. RAG 최소 구현 정리
3. OpenAI API 연결
4. 운동명 정규화 tool 구현
5. Agent workflow 정리
6. README / 발표자료 / 데모 안정화
```

---

## 12. 지금 구조에서 조심해야 할 점

### 1. React가 FastAPI를 직접 호출하면 안 된다

AI 분석은 반드시 NestJS를 거쳐야 한다.

이유:

- 인증은 NestJS가 담당한다.
- 현재 게시글과 이전 기록 조회는 NestJS가 담당한다.
- FastAPI는 AI 분석만 담당해야 한다.

---

### 2. 작성자 검사를 유지해야 한다

`POST /posts/:id/analyze`를 구현할 때는 로그인한 사용자만 호출할 수 있고, 작성자 본인의 게시글만 분석할 수 있어야 한다.

---

### 3. DB schema 변경은 조심해야 한다

Prisma schema 변경은 migration이 필요하다.

초보자에게 migration은 프로젝트를 깨뜨릴 수 있는 작업이므로, Codex는 schema 변경 전에 반드시 이유와 영향 범위를 설명해야 한다.

---

### 4. AI/RAG/MCP/Agent를 과장하면 안 된다

발표에서 중요한 것은 “완성형 AI 시스템”이라고 주장하는 것이 아니라, 현재 수준에서 구조를 정확히 설명하는 것이다.

---

## 13. 현재 상태 한 줄 정리

```text
게시판과 인증, FastAPI demo 분석 API, NestJS AiService 기본 구조는 준비되어 있다.
이제 남은 첫 핵심은 React 상세 화면 -> NestJS -> FastAPI -> React로 이어지는 AI 분석 연결을 다시 완성하는 것이다.
```
