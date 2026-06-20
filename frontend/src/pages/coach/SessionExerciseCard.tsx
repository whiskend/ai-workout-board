import { Check, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { SessionExerciseDraft, SessionSetDraft } from './sessionDraft';

type SessionExerciseCardProps = {
  exercise: SessionExerciseDraft;
  onDefer: (exerciseId: number) => void;
  onMemoChange: (exerciseId: number, memo: string) => void;
  onSetChange: (
    exerciseId: number,
    setId: number,
    patch: Partial<SessionSetDraft>,
  ) => void;
};

export function SessionExerciseCard({
  exercise,
  onDefer,
  onMemoChange,
  onSetChange,
}: SessionExerciseCardProps) {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-xl">{exercise.exerciseName}</CardTitle>
            <CardDescription>{exercise.targetLabel}</CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onDefer(exercise.assignmentExerciseId)}
          >
            <RotateCcw className="h-4 w-4" />
            나중에
          </Button>
        </div>
        {exercise.coachNote && (
          <p className="text-sm text-muted-foreground">{exercise.coachNote}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {exercise.sets.map((setDraft) => (
          <div
            key={setDraft.assignmentSetId}
            className="grid grid-cols-[4.5rem_1fr_1fr] items-end gap-2 rounded-lg border p-2"
          >
            <Button
              type="button"
              variant={setDraft.isDone ? 'default' : 'outline'}
              size="sm"
              onClick={() =>
                onSetChange(exercise.assignmentExerciseId, setDraft.assignmentSetId, {
                  isDone: !setDraft.isDone,
                })
              }
            >
              <Check className="h-4 w-4" />
              {setDraft.setNumber}
            </Button>
            <LabeledInput
              label="kg"
              value={setDraft.weightKg}
              onChange={(value) =>
                onSetChange(exercise.assignmentExerciseId, setDraft.assignmentSetId, {
                  weightKg: value,
                })
              }
            />
            <LabeledInput
              label="회"
              value={setDraft.reps}
              onChange={(value) =>
                onSetChange(exercise.assignmentExerciseId, setDraft.assignmentSetId, {
                  reps: value,
                })
              }
            />
          </div>
        ))}
        <Textarea
          value={exercise.memo}
          onChange={(event) =>
            onMemoChange(exercise.assignmentExerciseId, event.target.value)
          }
          placeholder="이 운동에 대한 짧은 메모"
        />
      </CardContent>
    </Card>
  );
}

type LabeledInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function LabeledInput({ label, value, onChange }: LabeledInputProps) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 text-center"
      />
    </div>
  );
}
