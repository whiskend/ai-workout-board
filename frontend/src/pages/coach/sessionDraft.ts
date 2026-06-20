import type {
  CompleteAssignmentRequest,
  WorkoutAssignmentExercise,
  WorkoutAssignmentSet,
} from '@/types/coach';

export type SessionSetDraft = {
  assignmentSetId: number;
  setNumber: number;
  weightKg: string;
  reps: string;
  perceivedDifficulty: string;
  isDone: boolean;
};

export type SessionExerciseDraft = {
  assignmentExerciseId: number;
  exerciseName: string;
  targetLabel: string;
  coachNote?: string | null;
  memo: string;
  sets: SessionSetDraft[];
};

export function createExerciseDraft(
  exercise: WorkoutAssignmentExercise,
): SessionExerciseDraft {
  return {
    assignmentExerciseId: exercise.id,
    exerciseName: exercise.exerciseName,
    targetLabel: `${exercise.targetSets}세트 / ${exercise.targetReps ?? '-'}회`,
    coachNote: exercise.coachNote,
    memo: '',
    sets: exercise.sets.map((set) => createSetDraft(set)),
  };
}

export function buildCompleteRequest(
  exerciseDrafts: readonly SessionExerciseDraft[],
  memo: string,
  isPublic: boolean,
): CompleteAssignmentRequest {
  return {
    memo,
    isPublic,
    exercises: exerciseDrafts.map((exercise) => ({
      assignmentExerciseId: exercise.assignmentExerciseId,
      memo: exercise.memo,
      sets: exercise.sets.map((setDraft) => ({
        assignmentSetId: setDraft.assignmentSetId,
        weightKg: parseNullableNumber(setDraft.weightKg),
        reps: setDraft.isDone ? parseInteger(setDraft.reps) : 0,
        perceivedDifficulty: parseNullableNumber(setDraft.perceivedDifficulty),
      })),
    })),
  };
}

function createSetDraft(set: WorkoutAssignmentSet): SessionSetDraft {
  return {
    assignmentSetId: set.id,
    setNumber: set.setNumber,
    weightKg: set.targetWeightKg?.toString() ?? '',
    reps: set.targetReps?.toString() ?? '',
    perceivedDifficulty: '',
    isDone: false,
  };
}

function parseInteger(value: string) {
  const parsed = Number.parseInt(value, 10);

  return Number.isFinite(parsed) ? parsed : 0;
}

function parseNullableNumber(value: string) {
  const parsed = Number(value);

  return value.trim() && Number.isFinite(parsed) ? parsed : null;
}
