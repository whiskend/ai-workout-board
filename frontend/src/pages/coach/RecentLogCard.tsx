import { formatDate } from '@/lib/format';
import type { WorkoutLog } from '@/types/coach';

type RecentLogCardProps = {
  log: WorkoutLog;
};

export function RecentLogCard({ log }: RecentLogCardProps) {
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
