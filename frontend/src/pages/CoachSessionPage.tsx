import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { completeAssignment, getAssignment } from '@/api/coach';
import { getStoredToken } from '@/api/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type { WorkoutAssignment } from '@/types/coach';
import { SessionExerciseCard } from './coach/SessionExerciseCard';
import {
  buildCompleteRequest,
  createExerciseDraft,
  type SessionExerciseDraft,
  type SessionSetDraft,
} from './coach/sessionDraft';

export default function CoachSessionPage() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const token = getStoredToken();
  const numericAssignmentId = Number(assignmentId);
  const [assignment, setAssignment] = useState<WorkoutAssignment | null>(null);
  const [exerciseDrafts, setExerciseDrafts] = useState<SessionExerciseDraft[]>([]);
  const [memo, setMemo] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const doneSetCount = useMemo(
    () =>
      exerciseDrafts.reduce(
        (total, exercise) =>
          total + exercise.sets.filter((setDraft) => setDraft.isDone).length,
        0,
      ),
    [exerciseDrafts],
  );
  const totalSetCount = useMemo(
    () =>
      exerciseDrafts.reduce((total, exercise) => total + exercise.sets.length, 0),
    [exerciseDrafts],
  );

  useEffect(() => {
    if (!token || !Number.isInteger(numericAssignmentId)) {
      setIsLoading(false);
      return;
    }

    async function loadAssignment() {
      try {
        setError('');
        const data = await getAssignment(numericAssignmentId);
        setAssignment(data);
        setExerciseDrafts(data.exercises.map(createExerciseDraft));
      } catch (error) {
        setError(error instanceof Error ? error.message : '운동 과제를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    void loadAssignment();
  }, [numericAssignmentId, token]);

  function updateSet(
    exerciseId: number,
    setId: number,
    patch: Partial<SessionSetDraft>,
  ) {
    setExerciseDrafts((drafts) =>
      drafts.map((exercise) =>
        exercise.assignmentExerciseId === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((setDraft) =>
                setDraft.assignmentSetId === setId
                  ? { ...setDraft, ...patch }
                  : setDraft,
              ),
            }
          : exercise,
      ),
    );
  }

  function updateExerciseMemo(exerciseId: number, nextMemo: string) {
    setExerciseDrafts((drafts) =>
      drafts.map((exercise) =>
        exercise.assignmentExerciseId === exerciseId
          ? { ...exercise, memo: nextMemo }
          : exercise,
      ),
    );
  }

  function deferExercise(exerciseId: number) {
    setExerciseDrafts((drafts) => {
      const selected = drafts.find(
        (exercise) => exercise.assignmentExerciseId === exerciseId,
      );

      if (!selected) {
        return drafts;
      }

      return [
        ...drafts.filter((exercise) => exercise.assignmentExerciseId !== exerciseId),
        selected,
      ];
    });
  }

  async function handleComplete() {
    if (!assignment) {
      return;
    }

    try {
      setError('');
      setIsSubmitting(true);
      await completeAssignment(
        assignment.id,
        buildCompleteRequest(exerciseDrafts, memo, isPublic),
      );
      navigate('/coach');
    } catch (error) {
      setError(error instanceof Error ? error.message : '운동 기록을 저장하지 못했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>로그인이 필요합니다</CardTitle>
          <CardDescription>운동 세션은 내 과제와 기록을 저장합니다.</CardDescription>
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
    return <div className="text-sm text-muted-foreground">운동 화면을 여는 중입니다.</div>;
  }

  if (!assignment || error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>운동 과제를 열 수 없습니다</CardTitle>
          <CardDescription>{error || '과제 정보를 찾지 못했습니다.'}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link to="/coach">코치 화면으로 돌아가기</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 pb-24">
      <div className="flex items-center justify-between gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link to="/coach">
            <ArrowLeft className="h-4 w-4" />
            나가기
          </Link>
        </Button>
        <Badge variant="secondary">
          {doneSetCount}/{totalSetCount}세트 완료
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{assignment.title}</CardTitle>
          <CardDescription>세트만 빠르게 체크하고, 필요한 값만 수정하세요.</CardDescription>
        </CardHeader>
      </Card>

      {exerciseDrafts.map((exercise) => (
        <SessionExerciseCard
          key={exercise.assignmentExerciseId}
          exercise={exercise}
          onDefer={deferExercise}
          onMemoChange={updateExerciseMemo}
          onSetChange={updateSet}
        />
      ))}

      <Card>
        <CardHeader>
          <CardTitle>마무리</CardTitle>
          <CardDescription>전체 운동 메모와 공유 여부만 정하면 됩니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
            placeholder="오늘 운동은 어땠나요?"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(event) => setIsPublic(event.target.checked)}
            />
            다른 사람이 볼 수 있게 공유하기
          </label>
          <Button className="w-full" onClick={handleComplete} disabled={isSubmitting}>
            {isSubmitting ? '저장 중' : '운동 완료'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
