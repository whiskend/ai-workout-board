# AWS 배포 준비 메모

## 1. 현재 추가된 배포 파일

```text
backend/Dockerfile
backend/.dockerignore
backend/.env.production.example

ai-server/Dockerfile
ai-server/.dockerignore
ai-server/.env.production.example

frontend/.env.production.example
docker-compose.prod.yml
```

## 2. 실제 서버에서 만들 파일

아래 파일은 Git에 올리지 않습니다.

```text
backend/.env.production
ai-server/.env.production
frontend/.env.production
```

예시 파일을 복사해서 실제 값을 채웁니다.

```bash
cp backend/.env.production.example backend/.env.production
cp ai-server/.env.production.example ai-server/.env.production
cp frontend/.env.production.example frontend/.env.production
```

## 3. 비밀값 만들기

`JWT_SECRET`과 `AI_INTERNAL_TOKEN`은 긴 랜덤 문자열이면 됩니다.

```bash
openssl rand -base64 32
```

두 번 실행해서 각각 넣습니다.

```text
JWT_SECRET=첫_번째_랜덤값
AI_INTERNAL_TOKEN=두_번째_랜덤값
```

중요합니다.

```text
backend/.env.production의 AI_INTERNAL_TOKEN
ai-server/.env.production의 AI_INTERNAL_TOKEN
```

두 값은 반드시 같아야 합니다.

## 4. backend/.env.production

```env
PORT=3000
DATABASE_URL=postgresql://RDS_USER:RDS_PASSWORD@RDS_ENDPOINT:5432/workout_board?schema=public
JWT_SECRET=아주긴랜덤문자열
AI_SERVER_URL=http://ai-server:8000
AI_INTERNAL_TOKEN=backend_ai서버_공유비밀값
```

## 5. ai-server/.env.production

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4.1-mini
AI_INTERNAL_TOKEN=backend_ai서버_공유비밀값
```

## 6. frontend/.env.production

처음 EC2 IP로 테스트할 때:

```env
VITE_API_BASE_URL=http://EC2_PUBLIC_IP:3000
```

나중에 API 도메인과 HTTPS를 붙이면:

```env
VITE_API_BASE_URL=https://api.example.com
```

## 7. EC2에서 실행

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

확인:

```bash
docker compose -f docker-compose.prod.yml ps
curl http://localhost:3000/health
curl http://localhost:3000/ai/health
```

## 8. RDS 마이그레이션

EC2에서 backend 컨테이너를 띄운 뒤 실행합니다.

```bash
docker compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
```

## 9. 주의

- `ai-server`는 외부 포트를 열지 않습니다.
- React는 FastAPI를 직접 호출하지 않습니다.
- React는 NestJS 주소만 봅니다.
- OpenAI API key, JWT secret, internal token은 GitHub에 올리면 안 됩니다.
