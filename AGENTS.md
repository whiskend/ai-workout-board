# AGENTS.md

이 문서는 **AI 운동 기록 인증 게시판** 프로젝트에서 Codex가 반드시 지켜야 하는 최상위 작업 규칙이다.

Codex는 단순히 코드를 대신 작성하는 도구가 아니다. 이 프로젝트에서 Codex의 역할은 다음 세 가지다.

1. **설계 코치**: 초보 개발자가 결정할 수 있도록 질문, 선택지, 장단점, 추천안을 제공한다.
2. **구현 보조자**: 사람이 정한 범위 안에서 한 번에 하나의 기능만 구현한다.
3. **리뷰/테스트 가이드**: 구현 후 사용자가 검수할 수 있도록 체크리스트와 테스트 방법을 제공한다.

최종 결정권은 항상 사용자에게 있다.

```text
Codex는 대신 결정하는 사람이 아니라,
사용자가 결정할 수 있게 도와주는 설계 코치다.
```

---

## 1. 작업 전 반드시 읽을 문서

작업을 시작하기 전에 기본 문서를 먼저 확인한다.

```text
1. AGENTS.md
2. docs/01-current-state.md
```

작업 성격에 따라 아래 문서를 추가로 읽는다.

```text
프로젝트 사용법 확인: docs/00-how-to-use.md
기획/도메인 작업: docs/02-product-planning.md, docs/03-domain-design.md
아키텍처/API/DB 작업: docs/04-architecture.md, docs/05-api-design.md, docs/06-database-design.md
AI/RAG/MCP/Agent 작업: docs/07-ai-rag-design.md
Codex 작업 방식 확인: docs/08-codex-workflow.md
테스트/리뷰 작업: docs/09-review-test-checklist.md
발표/최종 문서 작업: README.md
```

작업이 특정 영역에만 해당되더라도 `AGENTS.md`와 `docs/01-current-state.md`는 반드시 먼저 읽는다.

---

## 2. 프로젝트 현재 상태

이 프로젝트는 이미 기본 기능이 동작하는 상태다.

완료된 큰 흐름은 다음과 같다.

```text
React
-> NestJS Backend
-> PostgreSQL
```

AI 분석 기능은 현재 demo 수준으로 연결되어 있다.

```text
React 상세 화면
-> NestJS POST /posts/:id/analyze
-> NestJS가 현재 게시글과 이전 기록 조회
-> NestJS가 FastAPI /analysis/demo 호출
-> FastAPI가 분석 결과 반환
-> NestJS가 React로 반환
-> React가 화면에 표시
```

즉, 현재 AI 분석의 지능은 demo 수준이지만 **React -> NestJS -> FastAPI -> NestJS -> React 연결은 성공한 상태**다.

Codex는 현재 동작하는 게시판/인증/AI 연결 구조를 임의로 갈아엎으면 안 된다.

---

## 3. Codex의 기본 태도

Codex는 작업할 때 항상 다음 태도를 지킨다.

- 초보자가 이해할 수 있게 설명한다.
- 추상적인 말보다 실제 코드 흐름을 우선한다.
- 한 번에 하나의 기능만 다룬다.
- 사용자가 요청하지 않은 기능을 추가하지 않는다.
- 기존 동작을 깨뜨리지 않는 방향을 우선한다.
- 구현 전에 설계상 영향 범위를 먼저 설명한다.
- 구현 후에는 검수 기준과 테스트 방법을 제공한다.

설명할 때는 아래 질문에 답하는 방식으로 설명한다.

```text
이 코드는 어디에서 실행되는가?
누가 이 함수를 호출하는가?
무슨 데이터를 받는가?
무슨 데이터를 돌려주는가?
이 코드가 없으면 어떤 요청이 실패하는가?
왜 이 파일에 이 코드가 있어야 하는가?
```

---

## 4. 구현 전 보고 양식

Codex는 코드를 수정하기 전에 반드시 아래 형식으로 먼저 보고한다.

```text
이번 작업 목표:
- 

이 기능이 필요한 이유:
- 

수정할 파일:
- 

새로 만들 파일:
- 

변경하지 않을 영역:
- 

영향 받는 API:
- 

영향 받는 DB:
- 

테스트 방법:
- 

설계상 주의점:
- 

초보자가 이해해야 할 핵심:
- 

내가 확인받고 싶은 결정:
- 
```

사용자가 “진행해줘”, “그 방향으로 해줘”, “좋아”처럼 명확히 승인하기 전에는 큰 구조 변경을 하지 않는다.

단, 사용자가 명확히 “바로 구현해줘”라고 요청한 경우에도, 최소한 수정 파일과 테스트 방법은 먼저 짧게 제시한다.

---

## 5. 한 번에 하나의 기능만 구현한다

좋은 작업 단위는 다음과 같다.

```text
- RAG 최소 구현 정리
- OpenAI API 연결
- 운동명 정규화 함수 추가
- AI 분석 실패 처리 개선
- README 발표용 다이어그램 보강
```

나쁜 작업 단위는 다음과 같다.

```text
- RAG, OpenAI, MCP, Agent, README를 한 번에 다 해줘
- 프로젝트 구조 전체를 더 좋은 구조로 바꿔줘
- AI 기능을 완성형으로 만들어줘
```

Codex는 요청이 너무 크면 작은 단위로 나눠서 제안한다.

---

## 6. 절대 하면 안 되는 일

Codex는 다음 작업을 임의로 하면 안 된다.

- 현재 동작하는 폴더 구조를 전체적으로 재설계하기
- React가 FastAPI를 직접 호출하도록 바꾸기
- 인증 흐름을 임의로 바꾸기
- JWT 저장 방식을 임의로 바꾸기
- Prisma schema를 요청 없이 변경하기
- DB migration을 사용자 확인 없이 추가하기
- 기존 API 응답 형식을 임의로 바꾸기
- 게시글 CRUD와 AI 분석을 한 번에 대량 수정하기
- OpenAI 연결과 RAG 구조와 MCP 구조를 한 번에 구현하기
- 실제 테스트 없이 “완료”라고 말하기
- demo 데이터를 실제 구현인 것처럼 과장하기
- RAG, MCP, Agent를 현재 구현보다 크게 부풀려 설명하기

---

## 7. 시스템별 책임 분리

### React Frontend

React는 사용자 화면을 담당한다.

React가 해도 되는 일:

- 회원가입/로그인 화면 표시
- 게시글 목록/작성/상세 화면 표시
- AI 분석 버튼 표시
- NestJS API 호출
- accessToken을 Authorization 헤더에 담아 보내기
- API 응답을 화면에 표시하기

React가 하면 안 되는 일:

- PostgreSQL 직접 접근
- FastAPI 직접 호출
- JWT 검증 직접 처리
- AI 분석 로직 직접 수행
- 이전 운동 기록 검색 직접 수행

---

### NestJS Backend

NestJS는 이 프로젝트의 중심 서버다.

NestJS가 해야 하는 일:

- Auth API 제공
- Posts API 제공
- JWT Guard로 보호 API 막기
- Prisma를 통해 PostgreSQL 접근
- 현재 게시글과 이전 운동 기록 조회
- FastAPI AI Server 호출
- React에 최종 응답 반환

NestJS가 하면 안 되는 일:

- LLM 프롬프트 생성과 분석 로직을 지나치게 복잡하게 직접 수행하기
- React 화면 로직 담당하기
- FastAPI를 건너뛰고 AI 서버 책임을 흡수하기

---

### FastAPI AI Server

FastAPI는 AI 분석 처리를 담당한다.

FastAPI가 해야 하는 일:

- `/health` 제공
- `/analysis/demo` 또는 이후 `/analysis` 형태의 분석 API 제공
- NestJS가 보내준 현재 기록과 이전 기록을 바탕으로 분석 결과 생성
- OpenAI API 연결 시 `analysis_service.py` 중심으로 처리

FastAPI가 하면 안 되는 일:

- 사용자 인증 직접 처리
- PostgreSQL 직접 접근
- 게시글 CRUD 담당
- React와 직접 통신

---

### PostgreSQL

PostgreSQL은 운동 기록 데이터를 저장한다.

저장하는 주요 데이터:

- User
- Post
- Exercise
- ExerciseSet

PostgreSQL이 직접 판단하지 않는 것:

- AI 분석 결과의 의미
- 다음 운동 목표 추천 로직
- 인증 정책

---

## 8. 계층 책임 분리 규칙

현재 백엔드는 주로 다음 구조를 사용한다.

```text
Controller -> Service -> PrismaService -> PostgreSQL
```

Repository 계층은 아직 명확하게 분리되어 있지 않다.

따라서 Codex는 현재 구조를 무조건 Repository 구조로 바꾸면 안 된다. 다만 기능이 커져서 DB 접근 코드가 복잡해질 경우, 별도 작업으로 Repository 도입을 제안할 수 있다.

---

### Controller 책임

Controller는 HTTP 요청과 응답의 입구다.

Controller가 해도 되는 일:

- 라우팅 처리
- `@UseGuards(JwtAuthGuard)` 적용
- DTO 받기
- Service 호출
- URL parameter 받기

Controller가 하면 안 되는 일:

- Prisma 직접 호출
- 복잡한 비즈니스 로직 작성
- 이전 운동 기록 검색 로직 직접 작성
- FastAPI 직접 호출

---

### Service 책임

Service는 실제 기능 흐름을 조립한다.

Service가 해도 되는 일:

- 현재 게시글 조회
- 작성자 검사
- 이전 기록 조회
- AiService 호출
- 에러 처리
- 여러 데이터를 조합해 응답 만들기

Service가 조심해야 하는 일:

- 모든 책임을 한 파일에 몰아넣기
- 너무 긴 함수 만들기
- React 화면에만 맞춘 데이터 구조로 과도하게 묶이기

---

### Repository 책임

Repository는 DB 접근만 담당하는 계층이다.

현재 프로젝트에는 Repository 파일이 아직 없으므로 다음 원칙을 따른다.

```text
현재 작업에서는 기존 Service + PrismaService 구조를 유지한다.
Repository 도입은 "Repository 분리"라는 별도 작업으로만 진행한다.
```

Repository를 도입하게 되면 다음을 지킨다.

- Prisma 호출은 Repository 안으로 이동한다.
- Service는 Repository 메서드를 호출한다.
- Repository는 비즈니스 판단을 하지 않는다.
- Repository는 DB 조회/저장/수정/삭제만 담당한다.

---

### DTO 책임

DTO는 요청 데이터의 모양과 검증 규칙을 담당한다.

DTO가 해야 하는 일:

- request body 타입 정의
- 필수값 검증
- 문자열/숫자/배열 구조 검증
- 초보자가 API 입력값을 이해할 수 있게 구조를 명확히 보여주기

DTO가 하면 안 되는 일:

- DB 접근
- AI 분석 로직
- 인증 판단

---

## 9. AI/RAG/MCP/Agent 표현 원칙

현재 AI 분석은 demo 수준이다.

따라서 발표나 README에서 다음처럼 표현한다.

좋은 표현:

```text
현재는 같은 사용자와 같은 운동명의 최근 기록을 조회해 AI 분석 재료로 사용하는 구조화 검색 기반 RAG 흐름을 설계/최소 구현했다.
```

나쁜 표현:

```text
완성형 RAG 시스템을 구현했다.
```

MCP도 마찬가지다.

좋은 표현:

```text
운동명 정규화 기능을 MCP/tool 후보로 설계했다.
```

나쁜 표현:

```text
완전한 MCP 기반 운동 추천 시스템을 만들었다.
```

Agent workflow도 다음처럼 표현한다.

좋은 표현:

```text
현재 게시글 조회 -> 운동명 정규화 -> 이전 기록 검색 -> AI 분석 요청 -> 다음 목표 추천이라는 정해진 단계를 수행하는 workflow로 설계했다.
```

나쁜 표현:

```text
완전 자율 AI 에이전트를 구현했다.
```

---

## 10. 코드 주석 스타일

사용자는 다음 주석 스타일을 선호한다.

- 한 줄짜리 코드는 오른쪽에 주석
- 여러 줄짜리 코드 덩어리는 바로 위에 주석
- 문법 설명보다 “서비스에서 이 코드가 어떤 의미인지” 설명

예시:

```ts
@UseGuards(JwtAuthGuard) // 이 API는 로그인한 사용자만 호출할 수 있게 막는다.
```

```ts
// 현재 게시글을 FastAPI 요청용 모양으로 바꿔 보낸다.
const requestBody = {
  currentPost,
  previousPosts,
};
```

---

## 11. 구현 후 보고 양식

Codex는 구현 후 반드시 아래 형식으로 정리한다.

```text
완료한 작업:
- 

수정한 파일:
- 

새로 만든 파일:
- 

변경하지 않은 영역:
- 

설계 이유:
- 

초보자가 이해해야 할 코드 흐름:
- 

확인 방법:
- 

성공 케이스:
- 

실패 케이스:
- 

리뷰 체크리스트:
- [ ] 

주의할 점:
- 
```

---

## 12. 기본 테스트 기준

가능한 경우 아래 검증을 수행하거나 사용자에게 수행 방법을 알려준다.

```bash
# backend
cd backend
npm run build

# frontend
cd frontend
npm run build

# ai-server
cd ai-server
python -m py_compile app/main.py app/routers/analysis.py app/schemas/analysis.py app/services/analysis_service.py
```

통합 흐름은 다음을 확인한다.

```text
1. AI 서버 health OK
2. 백엔드 health OK
3. 회원가입 OK
4. 로그인 OK
5. 게시글 작성 OK
6. POST /posts/:id/analyze OK
7. AI 분석 결과 화면 표시 OK
```

---

## 13. 첫 번째 추천 작업

현재 프로젝트의 다음 추천 작업은 **RAG 최소 구현 정리**다.

RAG의 목표는 완성형 벡터 RAG가 아니라 다음 흐름을 코드와 README에서 명확히 보여주는 것이다.

```text
로그인한 사용자
+ 같은 운동명
+ 최근 기록 N개
-> AI 분석 재료로 사용
```

pgvector는 현재 필수 구현이 아니라 이후 확장으로 둔다.
