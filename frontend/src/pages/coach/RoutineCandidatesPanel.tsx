import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { RoutineCandidatesResponse } from '@/types/coach';

type RoutineCandidatesPanelProps = {
  routineCandidates: RoutineCandidatesResponse | null;
  selectingCandidateKey: string;
  onSelectCandidate: (candidateKey: string) => void;
};

export function RoutineCandidatesPanel({
  routineCandidates,
  selectingCandidateKey,
  onSelectCandidate,
}: RoutineCandidatesPanelProps) {
  if (!routineCandidates) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>루틴 후보를 준비하는 중입니다</CardTitle>
          <CardDescription>코치 설정을 기준으로 3가지 루틴을 만듭니다.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {routineCandidates.candidates.map((candidate) => (
        <Card key={candidate.key}>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>{candidate.name}</CardTitle>
              {candidate.isRecommended && <Badge>추천</Badge>}
              {routineCandidates.selectedCandidateKey === candidate.key && (
                <Badge variant="secondary">선택됨</Badge>
              )}
            </div>
            <CardDescription>{candidate.summary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">{candidate.description}</p>
            <p className="text-sm text-muted-foreground">
              {candidate.recommendationReason}
            </p>
            <div className="space-y-2">
              {candidate.days.map((day) => (
                <div key={day.dayIndex} className="rounded-lg border border-border p-3">
                  <div className="font-medium">{day.label}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {day.exercises.map((exercise) => (
                      <Badge key={`${day.dayIndex}-${exercise.exerciseName}`} variant="outline">
                        {exercise.exerciseName}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <Button
              onClick={() => onSelectCandidate(candidate.key)}
              disabled={
                selectingCandidateKey === candidate.key ||
                routineCandidates.selectedCandidateKey === candidate.key
              }
            >
              {selectingCandidateKey === candidate.key ? '선택 중' : '이 루틴 선택'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
