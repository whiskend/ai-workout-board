# 2026년 6월 13일 토요일 학습 문서

> 주제: FastAPI AI 서버 연결, NestJS에서 AI 서버 호출, 게시글 상세 화면에 AI 분석 버튼 붙이기  
> 목표: 게시글 상세 화면에서 `AI 분석` 버튼을 누르면 FastAPI AI 서버까지 요청이 갔다가 분석 결과가 화면에 표시되게 만든다.

---

# 0. 오늘 하는 것

오늘은 크게 세 가지를 한다.

```text
1. FastAPI AI 서버에 분석 API 만들기
2. NestJS에서 FastAPI를 호출하는 API 만들기
3. React 게시글 상세 화면에서 AI 분석 버튼 연결하기
```

한 문장으로 말하면:

```text
게시글 상세 화면
-> NestJS 백엔드
-> FastAPI AI 서버
-> 분석 결과
-> 다시 화면 표시
```

오늘 최종 흐름:

```text
사용자가 로그인한다.
        ↓
게시글 상세 화면에 들어간다.
        ↓
AI 분석 버튼을 누른다.
        ↓
React가 POST /posts/:id/analyze 요청을 보낸다.
        ↓
NestJS가 현재 게시글과 이전 기록을 조회한다.
        ↓
NestJS가 FastAPI /analysis/demo 로 분석 요청을 보낸다.
        ↓
FastAPI가 요약과 다음 운동 목표를 만든다.
        ↓
NestJS가 결과를 React에 돌려준다.
        ↓
React가 분석 결과를 화면에 표시한다.
```

오늘 연결할 API:

```text
GET  http://localhost:8000/health
POST http://localhost:8000/analysis/demo
POST http://localhost:3000/posts/:id/analyze
```

오늘 하지 않는 것:

```text
댓글
태그
페이징
완성형 RAG
완성형 MCP
완성형 Agent
pgvector embedding 검색
복잡한 프롬프트 엔지니어링
```

오늘은 **AI 서버 연결과 분석 버튼 동작**이 핵심이다.

---

# 1. 토요일 로드맵 기준 범위

구현로드맵의 토요일 범위는 아래다.

```text
6.1 오전: AI 서버 기본 연결
6.2 오후: 이전 기록 조회 붙이기
6.3 저녁: AI 분석 응답 화면 연결
```

즉 오늘 완료 기준은 이것이다.

```text
게시글 상세 화면에서 AI 분석 버튼 클릭
-> 요약 표시
-> 다음 운동 목표 표시
```

오늘은 AI 응답이 아주 똑똑할 필요는 없다.

먼저 중요한 것은:

```text
React
-> NestJS
-> FastAPI
-> NestJS
-> React
```

이 왕복 흐름이 실제로 되는 것이다.

---

# 2. 지금 상태

현재까지 된 것:

```text
회원가입
로그인
JWT accessToken 저장
게시글 작성
게시글 목록 조회
게시글 상세 조회
제목/운동명 검색
```

현재 AI 서버 상태:

```text
ai-server/app/main.py
ai-server/app/routers/demo.py
ai-server/app/schemas/message.py
ai-server/app/services/message_service.py
```

현재 AI 서버에는 `/hello`, `/chat` 같은 데모 API가 있다.

토요일에는 이 데모 서버를 운동 기록 분석 서버로 확장한다.

---

# 3. 오늘 만들 파일 구조

## 3.1 AI Server

```text
ai-server/app/
  main.py
  routers/
    analysis.py
  schemas/
    analysis.py
  services/
    analysis_service.py
```

역할:

| 파일 | 역할 |
| --- | --- |
| `schemas/analysis.py` | FastAPI가 받을 요청/응답 데이터 형식 |
| `services/analysis_service.py` | 운동 기록을 분석하는 실제 로직 |
| `routers/analysis.py` | `/analysis/demo` API 주소 정의 |
| `main.py` | FastAPI 앱에 router 등록 |

## 3.2 Backend

```text
backend/src/
  ai/
    ai.module.ts
    ai.service.ts
    types.ts
  posts/
    posts.controller.ts
    posts.service.ts
    posts.module.ts
```

역할:

| 파일 | 역할 |
| --- | --- |
| `ai.service.ts` | NestJS에서 FastAPI를 호출하는 작업자 |
| `ai.module.ts` | AiService를 NestJS에 등록하는 모듈 |
| `types.ts` | AI 서버에 보낼 데이터와 받을 데이터 타입 |
| `posts.controller.ts` | `POST /posts/:id/analyze` 주소 추가 |
| `posts.service.ts` | 현재 게시글과 이전 기록 조회 후 AiService 호출 |
| `posts.module.ts` | PostsService가 AiService를 쓸 수 있게 AiModule import |

## 3.3 Frontend

```text
frontend/src/
  api/
    posts.ts
  types/
    analysis.ts
  pages/
    PostDetailPage.tsx
```

역할:

| 파일 | 역할 |
| --- | --- |
| `types/analysis.ts` | 분석 결과 타입 |
| `api/posts.ts` | `analyzePost()` API 함수 추가 |
| `PostDetailPage.tsx` | AI 분석 버튼과 결과 화면 추가 |

---

# 4. FastAPI 분석 요청/응답 스키마 만들기

파일:

```text
ai-server/app/schemas/analysis.py
```

코드:

```py
from typing import Optional
from pydantic import BaseModel


class SetRecord(BaseModel):
    setNumber: int
    reps: int
    perceivedDifficulty: Optional[int] = None


class ExerciseRecord(BaseModel):
    exerciseName: str
    weightKg: float
    targetReps: Optional[int] = None
    sets: list[SetRecord]


class PostRecord(BaseModel):
    id: int
    title: str
    date: str
    bodyPart: str
    memo: Optional[str] = None
    exercises: list[ExerciseRecord]


class AnalysisRequest(BaseModel):
    currentPost: PostRecord
    previousPosts: list[PostRecord] = []


class AnalysisResponse(BaseModel):
    summary: str
    recommendation: str
    nextGoal: str
    referencedPostCount: int
```

해석:

```text
SetRecord
-> 1세트, 2세트 같은 세트 기록

ExerciseRecord
-> 벤치프레스 같은 운동 하나의 기록

PostRecord
-> 게시글 하나의 운동 기록

AnalysisRequest
-> NestJS가 FastAPI로 보낼 분석 요청 데이터

AnalysisResponse
-> FastAPI가 NestJS로 돌려줄 분석 결과
```

`BaseModel`은 FastAPI에서 요청/응답 데이터의 모양을 검사하는 기준이다.

`Optional[int]`, `Optional[str]`은 값이 있을 수도 있고 `None`일 수도 있다는 뜻이다.

현재 프로젝트의 Python 버전이 3.9 계열이므로 `int | None` 문법 대신 `Optional[int]`를 사용한다.

NestJS의 DTO와 비슷하게 보면 된다.

```text
NestJS DTO
-> TypeScript 백엔드에서 요청 body 검증

FastAPI Pydantic BaseModel
-> Python AI 서버에서 요청 body 검증
```

---

# 5. FastAPI 분석 서비스 만들기

파일:

```text
ai-server/app/services/analysis_service.py
```

코드:

```py
from app.schemas.analysis import AnalysisRequest, AnalysisResponse


def _format_main_exercise_name(request: AnalysisRequest) -> str:
    if not request.currentPost.exercises:
        return "운동"

    return request.currentPost.exercises[0].exerciseName


def _format_sets(request: AnalysisRequest) -> str:
    if not request.currentPost.exercises:
        return "기록 없음"

    first_exercise = request.currentPost.exercises[0]
    reps = [str(set_record.reps) for set_record in first_exercise.sets]

    return "/".join(reps)


def make_demo_analysis(request: AnalysisRequest) -> AnalysisResponse:
    exercise_name = _format_main_exercise_name(request)
    current_sets = _format_sets(request)
    previous_count = len(request.previousPosts)

    summary = f"{request.currentPost.title} 기록입니다. {exercise_name} 세트 기록은 {current_sets}회입니다."

    if previous_count == 0:
        recommendation = "아직 비교할 이전 기록이 부족합니다. 오늘 기록을 기준점으로 저장해두고 다음 운동 때 같은 조건으로 한 번 더 기록해보세요."
        next_goal = f"다음 운동에서는 {exercise_name}의 목표 반복 수를 안정적으로 채우는 것을 우선하세요."
    else:
        recommendation = "이전 기록이 있으므로 현재 기록과 비교할 수 있습니다. 오늘은 무게를 급하게 올리기보다 목표 반복 수를 먼저 채우는 방향이 좋습니다."
        next_goal = f"다음 운동에서는 {exercise_name}를 같은 무게로 진행하면서 마지막 세트 반복 수를 1회 늘리는 것을 목표로 해보세요."

    return AnalysisResponse(
        summary=summary,
        recommendation=recommendation,
        nextGoal=next_goal,
        referencedPostCount=previous_count,
    )
```

해석:

```text
make_demo_analysis()
-> 오늘은 GPT를 부르기 전에 임시 분석 결과를 만든다.

previousPosts가 없으면
-> 이전 기록이 부족하다고 말한다.

previousPosts가 있으면
-> 이전 기록과 비교할 수 있다고 말한다.
```

오늘은 여기서 OpenAI API를 바로 붙이지 않아도 된다.

이유:

```text
먼저 React -> NestJS -> FastAPI 연결이 되는지 확인해야 한다.
연결이 안 된 상태에서 GPT까지 붙이면 어디서 터졌는지 찾기 어렵다.
```

---

# 6. FastAPI 분석 라우터 만들기

파일:

```text
ai-server/app/routers/analysis.py
```

코드:

```py
from fastapi import APIRouter
from app.schemas.analysis import AnalysisRequest, AnalysisResponse
from app.services.analysis_service import make_demo_analysis

router = APIRouter()


@router.post("/demo", response_model=AnalysisResponse)
def analyze_demo(request: AnalysisRequest):
    return make_demo_analysis(request)
```

해석:

```text
POST /analysis/demo
-> 운동 기록 분석 요청을 받는다.
-> make_demo_analysis()를 실행한다.
-> AnalysisResponse 형식으로 응답한다.
```

여기서 `/analysis`는 나중에 `main.py`에서 prefix로 붙인다.

이 파일 안에서는 `/demo`만 적는다.

결과적으로 전체 주소는:

```text
POST /analysis/demo
```

---

# 7. FastAPI main.py 수정

파일:

```text
ai-server/app/main.py
```

코드:

```py
from fastapi import FastAPI
from app.routers.demo import router as demo_router
from app.routers.analysis import router as analysis_router

app = FastAPI()

app.include_router(demo_router)
app.include_router(analysis_router, prefix="/analysis", tags=["analysis"])


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "ai-server",
    }
```

해석:

```text
demo_router
-> 기존 데모 API 유지

analysis_router
-> 새로 만든 분석 API 등록

prefix="/analysis"
-> analysis.py 안의 /demo가 실제로는 /analysis/demo가 된다.

/health
-> AI 서버가 켜져 있는지 확인하는 API
```

---

# 8. FastAPI 실행과 테스트

터미널:

```bash
cd /Users/igyeong-geun/Documents/jungle/week15/ai-workout-board/ai-server
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

다른 터미널에서 확인:

```bash
curl http://localhost:8000/health
```

기대 응답:

```json
{
  "status": "ok",
  "service": "ai-server"
}
```

분석 API 테스트:

```bash
curl -X POST http://localhost:8000/analysis/demo \
  -H "Content-Type: application/json" \
  -d '{
    "currentPost": {
      "id": 1,
      "title": "오늘 가슴 운동",
      "date": "2026-06-13",
      "bodyPart": "가슴",
      "memo": "마지막 세트가 힘들었다",
      "exercises": [
        {
          "exerciseName": "벤치프레스",
          "weightKg": 60,
          "targetReps": 8,
          "sets": [
            { "setNumber": 1, "reps": 8 },
            { "setNumber": 2, "reps": 8 },
            { "setNumber": 3, "reps": 7 }
          ]
        }
      ]
    },
    "previousPosts": []
  }'
```

기대 응답:

```json
{
  "summary": "오늘 가슴 운동 기록입니다. 벤치프레스 세트 기록은 8/8/7회입니다.",
  "recommendation": "아직 비교할 이전 기록이 부족합니다...",
  "nextGoal": "다음 운동에서는 벤치프레스의 목표 반복 수를 안정적으로 채우는 것을 우선하세요.",
  "referencedPostCount": 0
}
```

---

# 9. NestJS AI 타입 만들기

파일:

```text
backend/src/ai/types.ts
```

코드:

```ts
export type AiSetRecord = {
  setNumber: number;
  reps: number;
  perceivedDifficulty?: number | null;
};

export type AiExerciseRecord = {
  exerciseName: string;
  weightKg: number;
  targetReps?: number | null;
  sets: AiSetRecord[];
};

export type AiPostRecord = {
  id: number;
  title: string;
  date: string;
  bodyPart: string;
  memo?: string | null;
  exercises: AiExerciseRecord[];
};

export type AnalyzePostRequest = {
  currentPost: AiPostRecord;
  previousPosts: AiPostRecord[];
};

export type AnalyzePostResponse = {
  summary: string;
  recommendation: string;
  nextGoal: string;
  referencedPostCount: number;
};
```

해석:

```text
FastAPI로 보낼 데이터 형식을 TypeScript에서도 정의한다.
```

FastAPI의 `AnalysisRequest`, `AnalysisResponse`와 같은 모양이어야 한다.

---

# 10. NestJS AiService 만들기

파일:

```text
backend/src/ai/ai.service.ts
```

코드:

```ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AnalyzePostRequest, AnalyzePostResponse } from './types';

@Injectable()
export class AiService {
  constructor(private readonly configService: ConfigService) {}

  async analyzePost(payload: AnalyzePostRequest): Promise<AnalyzePostResponse> {
    const aiServerUrl =
      this.configService.get<string>('AI_SERVER_URL') ?? 'http://localhost:8000';

    const response = await fetch(`${aiServerUrl}/analysis/demo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || 'AI 서버 요청에 실패했습니다.');
    }

    return response.json() as Promise<AnalyzePostResponse>;
  }
}
```

해석:

```text
AiService
-> NestJS 안에서 FastAPI를 호출하는 작업자

AI_SERVER_URL
-> FastAPI 서버 주소

fetch()
-> NestJS 서버가 FastAPI 서버로 HTTP 요청을 보냄
```

금요일에는 React가 NestJS에 `fetch`를 보냈다.

토요일에는 NestJS가 FastAPI에 `fetch`를 보낸다.

```text
금요일:
React -> fetch -> NestJS

토요일:
NestJS -> fetch -> FastAPI
```

---

# 11. NestJS AiModule 만들기

파일:

```text
backend/src/ai/ai.module.ts
```

코드:

```ts
import { Module } from '@nestjs/common';
import { AiService } from './ai.service';

@Module({
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
```

해석:

```text
providers: [AiService]
-> NestJS가 AiService 객체를 만들 수 있게 등록한다.

exports: [AiService]
-> 다른 모듈에서도 AiService를 가져다 쓸 수 있게 공개한다.
```

이걸 해야 `PostsService`에서 `AiService`를 주입받을 수 있다.

---

# 12. PostsModule에 AiModule 연결

파일:

```text
backend/src/posts/posts.module.ts
```

코드:

```ts
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AiModule } from '../ai/ai.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [AuthModule, AiModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
```

해석:

```text
PostsModule이 AiModule을 import한다.
        ↓
PostsService가 AiService를 constructor로 받을 수 있다.
```

---

# 13. PostsService에 AI 분석 메서드 추가

파일:

```text
backend/src/posts/posts.service.ts
```

추가 import:

```ts
import { AiService } from '../ai/ai.service';
import type { AiPostRecord } from '../ai/types';
```

constructor 수정:

```ts
constructor(
  private readonly prisma: PrismaService,
  private readonly aiService: AiService,
) {}
```

파일 위쪽에 변환 함수 추가:

```ts
function toAiPostRecord(post: any): AiPostRecord {
  return {
    id: post.id,
    title: post.title,
    date: post.date.toISOString().slice(0, 10),
    bodyPart: post.bodyPart,
    memo: post.memo,
    exercises: post.exercises.map((exercise) => ({
      exerciseName: exercise.exerciseName,
      weightKg: exercise.weightKg,
      targetReps: exercise.targetReps,
      sets: exercise.sets.map((set) => ({
        setNumber: set.setNumber,
        reps: set.reps,
        perceivedDifficulty: set.perceivedDifficulty,
      })),
    })),
  };
}
```

해석:

```text
Prisma에서 가져온 post 객체
-> FastAPI가 받기 쉬운 JSON 모양으로 변환
```

`PostsService` 클래스 안에 추가:

```ts
async analyze(userId: number, id: number) {
  const currentPost = await this.prisma.post.findUnique({
    where: { id },
    include: postInclude,
  });

  if (!currentPost) {
    throw new NotFoundException('게시글을 찾을 수 없습니다.');
  }

  if (currentPost.authorId !== userId) {
    throw new ForbiddenException('게시글을 분석할 권한이 없습니다.');
  }

  const normalizedNames = currentPost.exercises
    .map((exercise) => exercise.normalizedName)
    .filter((name): name is string => Boolean(name));

  const previousPosts = await this.prisma.post.findMany({
    where: {
      authorId: userId,
      id: {
        not: id,
      },
      exercises: {
        some: {
          normalizedName: {
            in: normalizedNames,
          },
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
    take: 3,
    include: postInclude,
  });

  return this.aiService.analyzePost({
    currentPost: toAiPostRecord(currentPost),
    previousPosts: previousPosts.map(toAiPostRecord),
  });
}
```

해석:

```text
1. 현재 게시글을 찾는다.
2. 게시글이 없으면 404를 던진다.
3. 작성자가 아니면 403을 던진다.
4. 현재 게시글의 운동명을 뽑는다.
5. 같은 운동명이 들어간 이전 게시글을 찾는다.
6. 현재 기록과 이전 기록을 FastAPI로 보낸다.
7. FastAPI 분석 결과를 그대로 반환한다.
```

여기서 `take: 3`은 이전 기록을 최대 3개만 가져오겠다는 뜻이다.

---

# 14. PostsController에 분석 API 추가

파일:

```text
backend/src/posts/posts.controller.ts
```

Controller 안에 추가:

```ts
@UseGuards(JwtAuthGuard)
@Post(':id/analyze')
analyze(
  @Req() request: AuthenticatedRequest,
  @Param('id', ParseIntPipe) id: number,
) {
  return this.postsService.analyze(request.user.id, id);
}
```

해석:

```text
POST /posts/:id/analyze
-> 특정 게시글을 AI 분석한다.

@UseGuards(JwtAuthGuard)
-> 로그인한 사용자만 요청할 수 있다.

request.user.id
-> JwtAuthGuard가 붙여둔 로그인 사용자 id다.

id
-> URL에서 가져온 게시글 id다.
```

---

# 15. 백엔드 환경변수 추가

파일:

```text
backend/.env
```

내용:

```env
AI_SERVER_URL=http://localhost:8000
```

해석:

```text
NestJS가 FastAPI 서버를 어디로 호출해야 하는지 알려주는 값이다.
```

코드에는 기본값도 넣어뒀기 때문에 이 값이 없어도 `http://localhost:8000`을 사용한다.

그래도 명시적으로 적어두는 편이 좋다.

---

# 16. NestJS 분석 API 테스트

먼저 세 개를 켠다.

터미널 1:

```bash
cd /Users/igyeong-geun/Documents/jungle/week15/ai-workout-board
docker compose up -d
```

터미널 2:

```bash
cd /Users/igyeong-geun/Documents/jungle/week15/ai-workout-board/ai-server
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

터미널 3:

```bash
cd /Users/igyeong-geun/Documents/jungle/week15/ai-workout-board/backend
npm run start:dev
```

로그인해서 token을 얻는다.

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"12345678"}'
```

게시글 분석 요청:

```bash
curl -X POST http://localhost:3000/posts/1/analyze \
  -H "Authorization: Bearer 여기에_accessToken"
```

기대 응답:

```json
{
  "summary": "오늘 가슴 운동 기록입니다...",
  "recommendation": "이전 기록이 있으므로...",
  "nextGoal": "다음 운동에서는...",
  "referencedPostCount": 1
}
```

---

# 17. 프론트 분석 타입 만들기

파일:

```text
frontend/src/types/analysis.ts
```

코드:

```ts
export type AnalysisResult = {
  summary: string;
  recommendation: string;
  nextGoal: string;
  referencedPostCount: number;
};
```

해석:

```text
백엔드가 돌려주는 AI 분석 결과의 타입이다.
```

---

# 18. 프론트 posts API에 analyzePost 추가

파일:

```text
frontend/src/api/posts.ts
```

추가 import:

```ts
import type { AnalysisResult } from '../types/analysis';
```

함수 추가:

```ts
export function analyzePost(id: number) {
  return apiRequest<AnalysisResult>(`/posts/${id}/analyze`, {
    method: 'POST',
    token: getStoredToken(),
  });
}
```

해석:

```text
analyzePost(1)
-> POST /posts/1/analyze 요청

token
-> 로그인한 사용자만 분석할 수 있으므로 accessToken을 보낸다.
```

---

# 19. 게시글 상세 화면에 AI 분석 버튼 추가

파일:

```text
frontend/src/pages/PostDetailPage.tsx
```

추가 import:

```ts
import { analyzePost, getPost } from '../api/posts';
import type { AnalysisResult } from '../types/analysis';
```

state 추가:

```ts
const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
const [isAnalyzing, setIsAnalyzing] = useState(false);
const [analysisError, setAnalysisError] = useState('');
```

함수 추가:

```ts
async function handleAnalyze() {
  setIsAnalyzing(true);
  setAnalysisError('');

  try {
    const result = await analyzePost(postId);
    setAnalysis(result);
  } catch (error) {
    setAnalysisError(error instanceof Error ? error.message : 'AI 분석에 실패했습니다.');
  } finally {
    setIsAnalyzing(false);
  }
}
```

화면 코드에서 운동 기록 섹션 아래에 추가:

```tsx
<section>
  <h2>AI 분석</h2>
  <button type="button" onClick={handleAnalyze} disabled={isAnalyzing}>
    {isAnalyzing ? '분석 중...' : 'AI 분석'}
  </button>

  {analysisError && <p>{analysisError}</p>}

  {analysis && (
    <article>
      <h3>요약</h3>
      <p>{analysis.summary}</p>

      <h3>추천</h3>
      <p>{analysis.recommendation}</p>

      <h3>다음 목표</h3>
      <p>{analysis.nextGoal}</p>

      <p>참고한 이전 기록 수: {analysis.referencedPostCount}</p>
    </article>
  )}
</section>
```

해석:

```text
AI 분석 버튼 클릭
-> handleAnalyze 실행
-> analyzePost(postId) 호출
-> 백엔드로 POST /posts/:id/analyze 요청
-> 결과를 analysis state에 저장
-> 화면에 요약/추천/다음 목표 표시
```

---

# 20. 오늘 테스트 흐름

## 20.1 FastAPI 단독 테스트

```bash
curl http://localhost:8000/health
```

```bash
curl -X POST http://localhost:8000/analysis/demo \
  -H "Content-Type: application/json" \
  -d '{...}'
```

## 20.2 NestJS 분석 API 테스트

```bash
curl -X POST http://localhost:3000/posts/1/analyze \
  -H "Authorization: Bearer 여기에_accessToken"
```

## 20.3 브라우저에서 확인

```text
1. 프론트 실행
2. 로그인
3. 게시글 상세 화면 이동
4. AI 분석 버튼 클릭
5. 분석 중 표시 확인
6. 요약/추천/다음 목표 표시 확인
```

---

# 21. 자주 터지는 문제

## 21.1 FastAPI 서버가 안 켜져 있음

증상:

```text
AI 서버 요청 실패
fetch failed
ECONNREFUSED
```

확인:

```bash
curl http://localhost:8000/health
```

## 21.2 NestJS에서 FastAPI 주소가 틀림

확인:

```text
AI_SERVER_URL=http://localhost:8000
```

## 21.3 token 없이 분석 요청

증상:

```text
401 Unauthorized
```

이유:

```text
POST /posts/:id/analyze는 JwtAuthGuard가 붙어 있으므로 로그인 token이 필요하다.
```

## 21.4 남의 게시글 분석

증상:

```text
403 Forbidden
```

이유:

```text
운동 기록 분석은 개인 기록 기반이라 작성자만 분석할 수 있게 막는다.
```

## 21.5 이전 기록이 0개

이건 오류가 아니다.

처음 작성한 운동 기록이면 비교할 과거 기록이 없을 수 있다.

응답에서:

```json
{
  "referencedPostCount": 0
}
```

이면 정상이다.

---

# 22. 오늘 마감 체크

```text
FastAPI /health 동작
FastAPI /analysis/demo 동작
NestJS POST /posts/:id/analyze 동작
현재 게시글 조회 가능
이전 기록 조회 가능
FastAPI로 현재 기록/이전 기록 전달 가능
React 상세 화면에 AI 분석 버튼 표시
분석 중 로딩 표시
분석 결과 화면 표시
frontend npm run build 성공
backend npm run build 성공
```

---

# 23. 오늘 완료 기준

오늘은 아래가 되면 성공이다.

```text
게시글 상세 화면에서 AI 분석 버튼을 누르면
요약, 추천, 다음 목표가 화면에 표시된다.
```

오늘 중요한 것은 AI 답변의 완성도가 아니다.

핵심은:

```text
React
-> NestJS
-> FastAPI
-> NestJS
-> React
```

이 연결이 실제로 동작하는 것이다.
