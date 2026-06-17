import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  CalendarDays,
  ClipboardList,
  Dumbbell,
  History,
  Settings2,
  Sparkles,
} from 'lucide-react';
import { getCoachDashboard } from '@/api/coach';
import { getStoredToken } from '@/api/client';
import { PageHeader } from '@/components/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatDate } from '@/lib/format';
import { formatCoachLabel, goalLabels, splitLabels } from '@/lib/coachOptions';
import type { CoachDashboard, WorkoutAssignment, WorkoutLog } from '@/types/coach';

const nextActionLabels: Record<CoachDashboard['nextAction'], string> = {
  complete_onboarding: '온보딩 필요',
  start_assignment: '오늘 과제 확인',
  generate_assignment: '과제 생성 대기',
};

function AssignmentCard({ assignment }: { assignment: WorkoutAssignment | null }) {
  if (!assignment) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>오늘의 운동 과제</CardTitle>
          <CardDescription>
            다음 PR에서 과제 생성 로직을 연결하면 이곳에 오늘 할 운동이 표시됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="secondary">
            <Link to="/onboarding">코치 설정 확인</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{assignment.title}</CardTitle>
        <CardDescription>{formatDate(assignment.scheduledDate)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {assignment.exercises.map((exercise) => (
          <div key={exercise.id} className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="font-medium">{exercise.exerciseName}</div>
              <Badge variant="outline">{exercise.targetSets}세트</Badge>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-sm text-muted-foreground">
              {exercise.targetWeightKg && <span>{exercise.targetWeightKg}kg</span>}
              {exercise.targetReps && <span>{exercise.targetReps}회 목표</span>}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function RecentLogCard({ log }: { log: WorkoutLog }) {
  const firstExercise = log.exercises[0];

  return (
    <div className="rounded-lg border border-border p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="font-medium">{log.bodyPart ?? '운동 기록'}</div>
        <span className="text-xs text-muted-foreground">{formatDate(log.workoutDate)}</span>
      </div>
      {firstExercise && (
        <p className="mt-2 text-sm text-muted-foreground">
          {firstExercise.exerciseName} 외 {Math.max(log.exercises.length - 1, 0)}개 운동
        </p>
      )}
    </div>
  );
}

export default function CoachPage() {
  const [dashboard, setDashboard] = useState<CoachDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const token = getStoredToken();

  useEffect(() => {
    async function loadDashboard() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        setError('');
        const data = await getCoachDashboard();
        setDashboard(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : '코치 대시보드를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, [token]);

  if (!token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>로그인이 필요합니다</CardTitle>
          <CardDescription>AI 코치 화면은 내 운동 설정과 기록을 기준으로 동작합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link to="/login">로그인하러 가기</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">코치 화면을 준비하는 중입니다.</div>;
  }

  if (error) {
    return (
      <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
        {error}
      </p>
    );
  }

  const profile = dashboard?.profile;
  const routineCycle = dashboard?.routineCycle;
  const currentDayLabel = routineCycle?.dayLabels[routineCycle.currentDayIndex] ?? '설정 전';

  return (
    <div>
      <PageHeader
        title="AI 코치"
        description="운동 환경과 기록을 바탕으로 오늘 해야 할 일을 확인하는 화면입니다."
        actions={
          <Button asChild variant="outline">
            <Link to="/onboarding">
              <Settings2 className="h-4 w-4" />
              코치 설정
            </Link>
          </Button>
        }
      />

      {!profile ? (
        <Card>
          <CardHeader>
            <CardTitle>먼저 코치 설정을 완료하세요</CardTitle>
            <CardDescription>
              사용 가능한 기구, 목표, 운동 시간을 알아야 오늘의 과제를 만들 수 있습니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/onboarding">온보딩 시작</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <Card>
                <CardHeader className="space-y-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">
                    {nextActionLabels[dashboard?.nextAction ?? 'complete_onboarding']}
                  </CardTitle>
                  <CardDescription>현재 코치 상태</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="space-y-2">
                  <Dumbbell className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">
                    {formatCoachLabel(goalLabels, profile.trainingGoal)}
                  </CardTitle>
                  <CardDescription>운동 목표</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="space-y-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">{currentDayLabel}</CardTitle>
                  <CardDescription>
                    {formatCoachLabel(splitLabels, profile.splitType)} / {profile.availableMinutes}분
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            <AssignmentCard assignment={dashboard?.todayAssignment ?? null} />
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  사용 가능한 기구
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {profile.availableEquipment.map((equipment) => (
                  <Badge key={equipment} variant="secondary">
                    {equipment}
                  </Badge>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  최근 수행 기록
                </CardTitle>
                <CardDescription>WorkoutLog 모델에 쌓일 수행 결과 영역입니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {dashboard?.recentLogs.length ? (
                  dashboard.recentLogs.map((log) => <RecentLogCard key={log.id} log={log} />)
                ) : (
                  <p className="text-sm text-muted-foreground">
                    아직 수행 기록이 없습니다. 다음 단계에서 오늘의 과제 수행 입력을 연결합니다.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
