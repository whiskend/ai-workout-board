# 08. Codex 작업 흐름

이 문서는 Codex에게 일을 맡기는 방법을 정리한다.

핵심은 다음이다.

```text
구현부터 시키지 말고,
설계 질문 -> 선택지 -> 결정 -> 구현 -> 리뷰 -> 테스트 순서로 진행한다.
```

---

## 1. Codex의 역할

이 프로젝트에서 Codex는 다음 역할을 한다.

```text
설계 코치
+ 구현 보조자
+ 리뷰 보조자
+ 테스트 가이드
+ README/발표 정리 보조자
```

하지만 최종 결정권은 사용자에게 있다.

---

## 2. 기능 시작 전 Codex에게 시킬 질문

기능을 시작하기 전에 아래 질문을 먼저 시킨다.

```text
이 기능은 현재 프로젝트에서 왜 필요한가?
MVP에 필요한가, 발표용인가, 나중 확장인가?
어느 도메인에 속하는가?
어떤 파일을 수정해야 하는가?
DB 변경이 필요한가?
API 변경이 필요한가?
React 화면 변경이 필요한가?
FastAPI 변경이 필요한가?
기존 기능을 깨뜨릴 위험은 무엇인가?
초보자가 이해해야 할 핵심 흐름은 무엇인가?
```

---

## 3. 구현 전 Codex가 반드시 답해야 하는 형식

Codex는 코드를 수정하기 전에 반드시 아래 형식으로 먼저 답한다.

```text
이번 작업 목표:
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

내가 결정해야 할 것:
- 
```

---

## 4. 좋은 프롬프트 예시

### 예시 1: RAG 최소 구현

```text
AGENTS.md와 docs/07-ai-rag-design.md를 읽어줘.
아직 코드를 수정하지 말고, 현재 POST /posts/:id/analyze 흐름을 기준으로 구조화 검색 기반 RAG 최소 구현을 어떻게 정리할지 먼저 설명해줘.

조건:
- pgvector는 지금 붙이지 않는다.
- 로그인한 사용자 + 같은 운동명 + 최근 기록 N개를 AI 분석 재료로 사용한다.
- React가 FastAPI를 직접 호출하지 않는 원칙은 유지한다.
- 기존 API 응답 형식은 가능하면 유지한다.
- 구현 전에 수정할 파일 목록과 테스트 방법을 먼저 말해줘.
```

---

### 예시 2: OpenAI 연결

```text
AGENTS.md와 docs/07-ai-rag-design.md를 읽어줘.
이번 작업은 FastAPI의 demo analysis를 OpenAI API 호출 구조로 바꾸는 거야.

아직 구현하지 말고 먼저 설계 설명부터 해줘.

조건:
- OpenAI 연결은 ai-server/app/services/analysis_service.py 중심으로 해줘.
- NestJS의 POST /posts/:id/analyze 응답 형식은 유지해줘.
- React 화면은 가능하면 수정하지 마.
- API Key는 환경변수로 읽게 해줘.
- 실패 시 어떤 에러 처리를 할지 설명해줘.
- 의학 조언을 하지 않는 안전 지시문을 포함해줘.
```

---

### 예시 3: MCP tool 후보 구현

```text
AGENTS.md와 docs/07-ai-rag-design.md를 읽어줘.
이번 작업은 운동명 정규화 tool의 최소 구현이야.

목표는 완전한 MCP 서버를 만드는 것이 아니라,
bench press, 벤치, 벤치프레스 같은 입력을 표준 운동명으로 바꾸는 작은 함수/서비스를 만드는 거야.

아직 구현하지 말고 먼저 다음을 설명해줘.
- 이 기능이 어느 계층에 들어가야 하는지
- 기존 DB의 normalizedName과 어떻게 연결할지
- 현재 RAG 검색 흐름에 어떤 도움이 되는지
- 수정할 파일과 테스트 방법
```

---

### 예시 4: README 발표용 정리

```text
AGENTS.md와 README.md, docs/01-current-state.md, docs/07-ai-rag-design.md를 읽어줘.
README를 발표용 문서로 정리해줘.

조건:
- Mermaid 다이어그램을 많이 사용해줘.
- 전체 아키텍처, AI 분석 흐름, DB ERD, RAG 흐름, Agent workflow를 넣어줘.
- 기능 구현 현황, 기술 스택, API는 표로 정리해줘.
- RAG/MCP/Agent를 과장하지 말고 현재 구현 수준에 맞게 표현해줘.
- 스크린샷 자리를 만들어줘.
```

---

## 5. 나쁜 프롬프트 예시

아래처럼 시키면 Codex가 프로젝트를 망가뜨릴 수 있다.

```text
AI 기능 완성해줘.
```

문제:

- 범위가 너무 넓다.
- RAG, OpenAI, MCP, Agent가 섞인다.
- 어떤 파일을 바꿀지 알 수 없다.

---

```text
프로젝트 구조 더 좋게 바꿔줘.
```

문제:

- 현재 동작하는 구조가 깨질 수 있다.
- Repository 도입, 폴더 이동, API 변경이 한 번에 일어날 수 있다.

---

```text
RAG랑 MCP랑 Agent 다 구현해줘.
```

문제:

- 발표용 설계와 실제 구현 범위가 섞인다.
- 과장된 결과가 나올 수 있다.

---

## 6. 기능별 추천 작업 방식

### RAG 최소 구현

목표:

```text
같은 사용자 + 같은 운동명 + 최근 기록 N개를 AI 분석 재료로 사용한다.
```

먼저 확인할 것:

```text
현재 PostsService.analyze()에서 이미 이전 기록을 조회하는가?
조회 조건이 사용자 기준인가?
운동명 기준인가?
최근 N개 제한이 있는가?
FastAPI 요청 body에 이전 기록이 포함되는가?
```

수정 가능 파일:

```text
backend/src/posts/posts.service.ts
backend/src/ai/types.ts
ai-server/app/schemas/analysis.py
ai-server/app/services/analysis_service.py
README.md
```

---

### OpenAI 연결

목표:

```text
FastAPI demo analysis를 실제 LLM 응답으로 교체한다.
```

수정 가능 파일:

```text
ai-server/app/services/analysis_service.py
ai-server/app/schemas/analysis.py
ai-server/app/routers/analysis.py
.env.example
README.md
```

변경하지 않을 영역:

```text
React가 FastAPI를 직접 호출하는 구조로 바꾸지 않는다.
NestJS의 /posts/:id/analyze API를 가능하면 유지한다.
DB schema를 바꾸지 않는다.
```

---

### MCP tool 후보

목표:

```text
운동명 정규화 기능을 tool처럼 분리한다.
```

수정 가능 파일 후보:

```text
backend/src/posts/posts.service.ts
backend/src/posts/exercise-name-normalizer.ts
ai-server/app/services/analysis_service.py
README.md
```

주의:

```text
처음부터 완전한 MCP 서버를 만들지 않는다.
발표에서는 "MCP/tool 후보" 또는 "tool 호출 구조로 확장 가능"이라고 표현한다.
```

---

## 7. 구현 후 Codex가 해야 하는 보고

구현 후에는 다음 형식으로 보고한다.

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

## 8. 사용자가 Codex 결과를 검수하는 방법

Codex가 코드를 만들면 바로 믿지 말고 다음을 확인한다.

```text
1. 수정 파일이 사전에 말한 목록과 같은가?
2. 요청하지 않은 파일을 건드리지 않았는가?
3. React가 FastAPI를 직접 호출하지 않는가?
4. 기존 API 응답 형식이 깨지지 않았는가?
5. 인증이 필요한 API에 Guard가 있는가?
6. build가 통과하는가?
7. 통합 흐름이 여전히 동작하는가?
8. README 설명이 과장되지 않았는가?
```

---

## 9. 첫 번째 실제 작업 프롬프트

현재 프로젝트에서 가장 추천하는 첫 작업은 RAG 최소 구현 정리다.

바로 사용할 수 있는 프롬프트:

```text
AGENTS.md와 docs 문서를 먼저 읽어줘.
아직 코드를 수정하지 말고, 현재 프로젝트 상태를 기준으로 RAG 최소 구현을 어떻게 정리하면 좋을지 설계 코치 역할로 설명해줘.

목표는 pgvector를 당장 붙이는 것이 아니라,
로그인한 사용자 + 같은 운동명 + 최근 기록 N개를 AI 분석 재료로 사용하는 구조화 검색 기반 RAG 흐름을 발표 가능하게 정리하는 거야.

다음 형식으로 먼저 답해줘.

이번 작업 목표:
수정할 파일:
새로 만들 파일:
변경하지 않을 영역:
영향 받는 API:
영향 받는 DB:
테스트 방법:
설계상 주의점:
초보자가 이해해야 할 핵심:
내가 결정해야 할 것:
```
