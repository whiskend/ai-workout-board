# 05. API 설계 문서

이 문서는 현재 구현된 API와 앞으로 API를 추가할 때의 기준을 정리한다.

API는 쉽게 말하면 “프론트엔드가 백엔드에게 요청을 보내는 약속”이다.

예:

```text
React가 로그인 버튼 클릭
-> POST /auth/login 요청
-> NestJS가 이메일/비밀번호 확인
-> accessToken 반환
```

---

## 1. API 설계 기본 원칙

API를 만들 때는 다음을 먼저 정한다.

```text
누가 호출하는가?
어떤 URL인가?
로그인이 필요한가?
무슨 데이터를 받는가?
무슨 데이터를 돌려주는가?
실패하면 어떤 에러가 나는가?
```

Codex는 API를 추가하기 전에 이 질문에 먼저 답해야 한다.

---

## 2. 현재 Auth API

| Method | Endpoint | 설명 | 인증 |
|---|---|---|---|
| POST | `/auth/signup` | 회원가입 | 없음 |
| POST | `/auth/login` | 로그인 | 없음 |
| GET | `/auth/me` | 현재 로그인 사용자 확인 | 필요 |

---

### POST /auth/signup

목적:

```text
새 사용자를 만든다.
```

흐름:

```text
React SignupPage
-> signup()
-> POST /auth/signup
-> AuthController.signup()
-> AuthService.signup()
-> 비밀번호 해싱
-> User 저장
```

받는 데이터 예시:

```json
{
  "email": "test@example.com",
  "nickname": "운동초보",
  "password": "password123"
}
```

---

### POST /auth/login

목적:

```text
이메일과 비밀번호를 확인하고 accessToken을 발급한다.
```

흐름:

```text
React LoginPage
-> login()
-> POST /auth/login
-> AuthController.login()
-> AuthService.login()
-> User 조회
-> 비밀번호 비교
-> JWT 발급
-> accessToken 반환
```

응답 예시:

```json
{
  "accessToken": "jwt-token-value"
}
```

---

### GET /auth/me

목적:

```text
현재 accessToken이 유효한지 확인하고 내 정보를 가져온다.
```

인증 헤더:

```text
Authorization: Bearer accessToken
```

---

## 3. 현재 Posts API

| Method | Endpoint | 설명 | 인증 |
|---|---|---|---|
| POST | `/posts` | 게시글 작성 | 필요 |
| GET | `/posts` | 게시글 목록 | 없음 |
| GET | `/posts?keyword=벤치프레스` | 제목/운동명 검색 | 없음 |
| GET | `/posts/:id` | 게시글 상세 | 없음 |
| PATCH | `/posts/:id` | 게시글 수정 | 필요 |
| DELETE | `/posts/:id` | 게시글 삭제 | 필요 |
| POST | `/posts/:id/analyze` | AI 분석 요청 | 필요 |

---

## 4. 보호 API와 공개 API

### 보호 API

로그인이 필요한 API다.

```text
POST /posts
PATCH /posts/:id
DELETE /posts/:id
POST /posts/:id/analyze
GET /auth/me
```

보호 API는 다음 헤더가 필요하다.

```text
Authorization: Bearer accessToken
```

---

### 공개 API

로그인 없이 볼 수 있는 API다.

```text
GET /posts
GET /posts/:id
POST /auth/signup
POST /auth/login
```

---

## 5. accessToken / Bearer 인증 흐름

로그인 후 흐름:

```text
1. React가 POST /auth/login 요청
2. NestJS가 accessToken 반환
3. React가 accessToken을 localStorage에 저장
4. 보호 API 호출 시 Authorization 헤더에 넣음
5. JwtAuthGuard가 토큰 검사
6. 통과하면 Controller가 실행됨
```

실제 요청 형태:

```text
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

초보자가 이해할 핵심:

```text
Bearer는 "이 토큰을 가진 사용자가 요청합니다"라는 표시다.
JwtAuthGuard는 그 토큰이 진짜인지 확인하는 문지기다.
```

---

## 6. POST /posts/:id/analyze 상세 흐름

이 API는 AI 분석 요청의 중심이다.

목적:

```text
현재 게시글과 이전 운동 기록을 바탕으로 AI 분석 결과를 받는다.
```

인증:

```text
필요
```

흐름:

```text
React 상세 화면
-> AI 분석 버튼 클릭
-> analyzePost(postId)
-> apiRequest()
-> POST /posts/:id/analyze
-> JwtAuthGuard가 accessToken 검사
-> PostsController.analyze()
-> PostsService.analyze()
-> 현재 게시글 조회
-> 작성자 검사
-> 같은 운동명의 이전 기록 조회
-> AiService.analyzePost()
-> FastAPI /analysis/demo 호출
-> 분석 결과 반환
-> React 화면 표시
```

응답 예시:

```json
{
  "summary": "AI 분석 테스트 가슴 운동 기록입니다. 벤치프레스 세트 기록은 8/8/7회입니다.",
  "recommendation": "아직 비교할 이전 기록이 부족합니다. 오늘 기록을 기준점으로 저장해두고 다음 운동 때 같은 조건으로 한 번 더 기록해보세요.",
  "nextGoal": "다음 운동에서는 벤치프레스의 목표 반복 수를 안정적으로 채우는 것을 우선하세요.",
  "referencedPostCount": 0
}
```

---

## 7. API 추가 전 질문

새 API를 추가하기 전에 Codex는 아래 질문에 답해야 한다.

```text
이 API는 왜 필요한가?
React의 어떤 화면에서 호출하는가?
로그인이 필요한가?
작성자 확인이 필요한가?
request body는 무엇인가?
response는 무엇인가?
DTO가 필요한가?
DB schema 변경이 필요한가?
기존 API와 역할이 겹치지 않는가?
실패 케이스는 무엇인가?
```

---

## 8. API 설계 체크리스트

API를 설계할 때 확인한다.

```text
[ ] URL이 기능을 잘 설명하는가?
[ ] HTTP Method가 적절한가?
[ ] 보호 API라면 JwtAuthGuard가 적용되는가?
[ ] 작성자 권한 확인이 필요한가?
[ ] DTO로 입력값을 검증하는가?
[ ] 응답 형식이 프론트에서 쓰기 쉬운가?
[ ] 기존 응답 형식을 깨뜨리지 않는가?
[ ] 실패 시 에러 메시지가 이해 가능한가?
[ ] README의 API 표도 업데이트해야 하는가?
```

---

## 9. AI 관련 API를 추가할 때 주의점

AI 관련 API는 특히 다음을 지킨다.

```text
React는 FastAPI를 직접 호출하지 않는다.
NestJS가 인증, 권한 확인, DB 조회를 담당한다.
FastAPI는 분석만 담당한다.
```

좋은 흐름:

```text
React
-> NestJS AI 요청 API
-> NestJS가 DB 조회
-> FastAPI 호출
-> NestJS가 React로 반환
```

나쁜 흐름:

```text
React
-> FastAPI 직접 호출
-> FastAPI가 DB 조회와 인증까지 처리
```

---

## 10. 다음 API 후보

현재 단계에서 새 API를 많이 늘릴 필요는 없다.

후보는 다음 정도다.

| 후보 API | 목적 | 우선순위 |
|---|---|---|
| 기존 `POST /posts/:id/analyze` 개선 | RAG/OpenAI 연결 중심 API로 유지 | 높음 |
| `GET /posts/:id/history` | 특정 운동의 이전 기록 확인 | 낮음 |
| `POST /ai/normalize-exercise` | 운동명 정규화 테스트 | 낮음 |

우선은 기존 `POST /posts/:id/analyze`를 유지하면서 내부 흐름을 발전시키는 것이 안전하다.
