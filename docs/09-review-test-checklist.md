# 09. 리뷰 / 테스트 체크리스트

이 문서는 Codex가 만든 코드를 사용자가 검수할 때 사용하는 체크리스트다.

초보자라도 아래 질문을 따라가면 “무엇을 봐야 하는지” 감을 잡을 수 있다.

---

## 1. 설계 리뷰 체크리스트

```text
[ ] 이번 작업이 한 가지 기능에만 집중했는가?
[ ] Codex가 구현 전에 수정할 파일을 먼저 말했는가?
[ ] 실제 수정한 파일이 사전 보고와 일치하는가?
[ ] 요청하지 않은 큰 구조 변경이 없는가?
[ ] 기존 동작하는 흐름을 깨뜨리지 않았는가?
[ ] React -> NestJS -> FastAPI 흐름을 유지했는가?
[ ] DB schema 변경이 있다면 이유와 migration이 설명되었는가?
[ ] RAG/MCP/Agent 표현이 과장되지 않았는가?
```

---

## 2. Backend 리뷰 체크리스트

```text
[ ] Controller가 Prisma를 직접 호출하지 않는가?
[ ] Controller가 복잡한 비즈니스 로직을 갖고 있지 않은가?
[ ] Controller는 요청을 받고 Service를 호출하는 역할에 집중하는가?
[ ] Service가 현재 게시글 조회, 작성자 검사, 이전 기록 조회 흐름을 명확히 처리하는가?
[ ] Service 함수가 너무 길어져서 이해하기 어렵지 않은가?
[ ] AiService 호출 위치가 적절한가?
[ ] 기존 API 응답 형식이 깨지지 않았는가?
[ ] 에러 처리가 NestJS 예외 클래스로 되어 있는가?
[ ] any 타입을 불필요하게 쓰지 않았는가?
[ ] build가 통과하는가?
```

---

## 3. Frontend 리뷰 체크리스트

```text
[ ] React가 FastAPI를 직접 호출하지 않는가?
[ ] 모든 AI 분석 요청은 NestJS /posts/:id/analyze로 가는가?
[ ] accessToken이 보호 API 요청에 포함되는가?
[ ] AI 분석 로딩 상태가 있는가?
[ ] AI 분석 실패 시 화면이 깨지지 않는가?
[ ] 응답 타입이 frontend/src/types/analysis.ts와 맞는가?
[ ] 기존 게시글 목록/작성/상세 화면이 깨지지 않는가?
[ ] npm run build가 통과하는가?
```

---

## 4. FastAPI 리뷰 체크리스트

```text
[ ] FastAPI는 AI 분석 책임만 담당하는가?
[ ] FastAPI가 PostgreSQL을 직접 조회하지 않는가?
[ ] FastAPI가 사용자 인증을 직접 처리하지 않는가?
[ ] Pydantic BaseModel이 요청/응답 구조를 명확히 표현하는가?
[ ] /health가 계속 동작하는가?
[ ] /analysis/demo 또는 분석 API가 기존 응답 구조를 유지하는가?
[ ] OpenAI 연결 시 API Key를 코드에 직접 적지 않았는가?
[ ] AI 응답이 의학 조언이나 부상 진단으로 흐르지 않게 제한했는가?
[ ] Python 문법 확인이 통과하는가?
```

---

## 5. DB 리뷰 체크리스트

```text
[ ] Prisma schema를 수정했는가?
[ ] 수정했다면 migration이 필요한가?
[ ] 기존 데이터와 충돌하지 않는가?
[ ] User -> Post -> Exercise -> ExerciseSet 관계가 유지되는가?
[ ] RAG 검색에 필요한 운동명/사용자/날짜 정보가 유지되는가?
[ ] normalizedName을 사용한다면 기존 exerciseName과 역할이 구분되는가?
[ ] README ERD도 업데이트했는가?
```

---

## 6. 인증/JWT 리뷰 체크리스트

```text
[ ] 로그인이 필요한 API에 JwtAuthGuard가 적용되어 있는가?
[ ] POST /posts/:id/analyze는 로그인한 사용자만 호출 가능한가?
[ ] 게시글 수정/삭제는 작성자만 가능한가?
[ ] AI 분석도 작성자 본인의 게시글만 가능한가?
[ ] accessToken이 localStorage에서 읽혀 Authorization 헤더에 들어가는가?
[ ] Bearer 형식이 깨지지 않았는가?
[ ] GET /auth/me가 여전히 동작하는가?
```

---

## 7. AI 분석 기능 리뷰 체크리스트

```text
[ ] 현재 게시글을 제대로 조회하는가?
[ ] 작성자 검사를 하는가?
[ ] 현재 게시글의 운동명을 추출하는가?
[ ] 같은 사용자의 이전 기록만 조회하는가?
[ ] 같은 운동명의 이전 기록을 우선 사용하는가?
[ ] 최근 기록 N개 제한이 있는가?
[ ] FastAPI로 currentPost와 previousPosts가 전달되는가?
[ ] FastAPI 응답이 summary, recommendation, nextGoal, referencedPostCount를 포함하는가?
[ ] 이전 기록이 없을 때도 화면이 깨지지 않는가?
[ ] AI 분석 실패 시 사용자에게 이해 가능한 메시지가 보이는가?
```

---

## 8. RAG/MCP/Agent 표현 리뷰 체크리스트

```text
[ ] pgvector 없이 구조화 검색 기반 RAG라고 정확히 표현했는가?
[ ] 완성형 벡터 RAG라고 과장하지 않았는가?
[ ] MCP는 운동명 정규화 tool 후보라고 표현했는가?
[ ] 완성형 MCP 서버라고 과장하지 않았는가?
[ ] Agent는 정해진 workflow라고 표현했는가?
[ ] 완전 자율 에이전트라고 과장하지 않았는가?
[ ] README와 발표자료의 표현이 현재 구현 수준과 맞는가?
```

---

## 9. 테스트 체크리스트

### Backend build

```bash
cd backend
npm run build
```

확인:

```text
[ ] TypeScript build가 통과하는가?
[ ] 새 타입 에러가 없는가?
```

---

### Frontend build

```bash
cd frontend
npm run build
```

확인:

```text
[ ] React build가 통과하는가?
[ ] 타입 에러가 없는가?
[ ] 사용하지 않는 import로 실패하지 않는가?
```

---

### FastAPI 문법 확인

```bash
cd ai-server
python -m py_compile app/main.py app/routers/analysis.py app/schemas/analysis.py app/services/analysis_service.py
```

확인:

```text
[ ] Python 문법 에러가 없는가?
```

---

### 통합 테스트

```text
[ ] AI 서버 health OK
[ ] 백엔드 health OK
[ ] 회원가입 OK
[ ] 로그인 OK
[ ] 게시글 작성 OK
[ ] 게시글 목록 확인 OK
[ ] 게시글 상세 확인 OK
[ ] POST /posts/:id/analyze OK
[ ] AI 분석 결과 화면 표시 OK
```

---

## 10. 발표 전 데모 안정화 체크리스트

```text
[ ] 데모용 계정을 준비했는가?
[ ] 데모용 운동 기록을 2개 이상 준비했는가?
[ ] 같은 운동명 기록이 있어 AI 분석에서 이전 기록을 참고할 수 있는가?
[ ] AI 분석 버튼이 정상 동작하는가?
[ ] 네트워크 오류가 나지 않는가?
[ ] README에 아키텍처 다이어그램이 보이는가?
[ ] README에 DB ERD가 보이는가?
[ ] README에 RAG 흐름이 보이는가?
[ ] README에 데모 시나리오가 정리되어 있는가?
[ ] 화면 캡처가 깨지지 않는가?
[ ] 현재 한계와 향후 개선 방향을 솔직하게 적었는가?
```

---

## 11. 사용자용 최종 질문

Codex가 작업을 마친 뒤 사용자는 마지막으로 이렇게 물어본다.

```text
내가 초보자라고 생각하고,
이번 변경에서 꼭 이해해야 할 코드 흐름을 React -> NestJS -> DB/FastAPI 순서로 다시 설명해줘.

그리고 내가 직접 확인해야 할 체크리스트를 5개만 뽑아줘.
```

이 질문을 하면 단순히 코드만 받는 것이 아니라 설계를 복습할 수 있다.
