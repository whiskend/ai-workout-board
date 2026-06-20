import { Link } from 'react-router';
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
import type { WorkoutAssignment } from '@/types/coach';

type AssignmentCardProps = {
  assignment: WorkoutAssignment | null;
  canCreateAssignment: boolean;
  isCreatingAssignment: boolean;
  onCreateAssignment: () => void;
};

export function AssignmentCard({
  assignment,
  canCreateAssignment,
  isCreatingAssignment,
  onCreateAssignment,
}: AssignmentCardProps) {
  if (!assignment) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>오늘의 운동 과제</CardTitle>
          <CardDescription>
            루틴을 선택하면 오늘 해야 할 운동을 바로 만들 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {canCreateAssignment ? (
            <Button onClick={onCreateAssignment} disabled={isCreatingAssignment}>
              {isCreatingAssignment ? '만드는 중' : '오늘 운동 만들기'}
            </Button>
          ) : (
            <Button asChild variant="secondary">
              <Link to="/onboarding">코치 설정 확인</Link>
            </Button>
          )}
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
        {assignment.status === 'completed' ? (
          <Badge variant="secondary">완료됨</Badge>
        ) : (
          <Button asChild className="w-full sm:w-auto">
            <Link to={`/coach/session/${assignment.id}`}>운동 시작</Link>
          </Button>
        )}
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
            {exercise.coachNote && (
              <p className="mt-2 text-sm text-muted-foreground">{exercise.coachNote}</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
