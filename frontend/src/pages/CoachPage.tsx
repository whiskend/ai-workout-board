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
import {
  createTodayAssignment,
  getCoachDashboard,
  getRoutineCandidates,
  selectRoutineCandidate,
} from '@/api/coach';
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
import { formatCoachLabel, goalLabels, splitLabels } from '@/lib/coachOptions';
import type { CoachDashboard, RoutineCandidatesResponse } from '@/types/coach';
import { AssignmentCard } from './coach/AssignmentCard';
import { RecentLogCard } from './coach/RecentLogCard';
import { RoutineCandidatesPanel } from './coach/RoutineCandidatesPanel';

const nextActionLabels: Record<CoachDashboard['nextAction'], string> = {
  complete_onboarding: '온보딩 필요',
  select_routine: '루틴 선택 필요',
  start_assignment: '오늘 과제 확인',
  generate_assignment: '과제 생성 대기',
};

export default function CoachPage() {
  const [dashboard, setDashboard] = useState<CoachDashboard | null>(null);
  const [routineCandidates, setRoutineCandidates] =
    useState<RoutineCandidatesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);
  const [selectingCandidateKey, setSelectingCandidateKey] = useState('');
  const [error, setError] = useState('');
  const token = getStoredToken();

  async function loadCoachData() {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      setError('');
      const data = await getCoachDashboard();
      setDashboard(data);

      if (data.profile && data.nextAction === 'select_routine') {
        setRoutineCandidates(await getRoutineCandidates());
      } else {
        setRoutineCandidates(null);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '코치 대시보드를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCoachData();
  }, [token]);

  async function handleSelectCandidate(candidateKey: string) {
    try {
      setError('');
      setSelectingCandidateKey(candidateKey);
      await selectRoutineCandidate(candidateKey);
      await loadCoachData();
    } catch (error) {
      setError(error instanceof Error ? error.message : '루틴을 선택하지 못했습니다.');
    } finally {
      setSelectingCandidateKey('');
    }
  }

  async function handleCreateAssignment() {
    try {
      setError('');
      setIsCreatingAssignment(true);
      await createTodayAssignment();
      await loadCoachData();
    } catch (error) {
      setError(error instanceof Error ? error.message : '오늘 운동을 만들지 못했습니다.');
    } finally {
      setIsCreatingAssignment(false);
    }
  }

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
  const canCreateAssignment = dashboard?.nextAction === 'generate_assignment';

  return (
    <div>
      <PageHeader
        title="AI 코치"
        description="오늘 해야 할 운동을 만들고 기록 흐름으로 이어가는 화면입니다."
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

            {dashboard?.nextAction === 'select_routine' ? (
              <RoutineCandidatesPanel
                routineCandidates={routineCandidates}
                selectingCandidateKey={selectingCandidateKey}
                onSelectCandidate={handleSelectCandidate}
              />
            ) : (
              <AssignmentCard
                assignment={dashboard?.todayAssignment ?? null}
                canCreateAssignment={canCreateAssignment}
                isCreatingAssignment={isCreatingAssignment}
                onCreateAssignment={handleCreateAssignment}
              />
            )}
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
                <CardDescription>수행 기록이 쌓이면 최근 운동이 여기에 표시됩니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {dashboard?.recentLogs.length ? (
                  dashboard.recentLogs.map((log) => <RecentLogCard key={log.id} log={log} />)
                ) : (
                  <p className="text-sm text-muted-foreground">
                    아직 수행 기록이 없습니다. 오늘 과제를 만들고 첫 기록을 남기면 됩니다.
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
