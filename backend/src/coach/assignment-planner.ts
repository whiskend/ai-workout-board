export type AssignmentRoutineExercise = {
  readonly exerciseName: string;
  readonly normalizedName: string;
  readonly equipmentType: string;
  readonly targetSets: number;
  readonly targetReps: number;
  readonly baseWeightKg: number | null;
  readonly orderIndex: number;
  readonly coachNote: string | null;
};

export type PreviousExerciseRecord = {
  readonly normalizedName: string;
  readonly weightKg: number | null;
  readonly targetReps: number | null;
  readonly sets: readonly {
    readonly setNumber: number;
    readonly reps: number;
  }[];
};

export type AssignmentExercisePlan = {
  readonly exerciseName: string;
  readonly normalizedName: string;
  readonly targetWeightKg: number | null;
  readonly targetSets: number;
  readonly targetReps: number;
  readonly orderIndex: number;
  readonly coachNote: string;
  readonly sets: readonly {
    readonly setNumber: number;
    readonly targetWeightKg: number | null;
    readonly targetReps: number;
  }[];
};

export function buildAssignmentExercisePlans(
  routineExercises: readonly AssignmentRoutineExercise[],
  previousRecords: readonly PreviousExerciseRecord[],
  trainingGoal: string,
): readonly AssignmentExercisePlan[] {
  const previousByName = new Map(
    previousRecords.map((record) => [record.normalizedName, record]),
  );

  return routineExercises.map((exercise) =>
    buildAssignmentExercisePlan(
      exercise,
      previousByName.get(exercise.normalizedName),
      trainingGoal,
    ),
  );
}

function buildAssignmentExercisePlan(
  exercise: AssignmentRoutineExercise,
  previousRecord: PreviousExerciseRecord | undefined,
  trainingGoal: string,
): AssignmentExercisePlan {
  const previousWeightKg = previousRecord?.weightKg ?? exercise.baseWeightKg;
  const previousTargetReps = previousRecord?.targetReps ?? exercise.targetReps;
  const wasCompleted = previousRecord
    ? didCompleteTarget(previousRecord, exercise.targetSets, previousTargetReps)
    : false;
  const nextTarget = getNextTarget(
    previousWeightKg,
    previousTargetReps,
    exercise,
    trainingGoal,
    wasCompleted,
  );

  return {
    exerciseName: exercise.exerciseName,
    normalizedName: exercise.normalizedName,
    targetWeightKg: nextTarget.targetWeightKg,
    targetSets: exercise.targetSets,
    targetReps: nextTarget.targetReps,
    orderIndex: exercise.orderIndex,
    coachNote: buildCoachNote(exercise, wasCompleted, nextTarget.reason),
    sets: Array.from({ length: exercise.targetSets }, (_, index) => ({
      setNumber: index + 1,
      targetWeightKg: nextTarget.targetWeightKg,
      targetReps: nextTarget.targetReps,
    })),
  };
}

function didCompleteTarget(
  previousRecord: PreviousExerciseRecord,
  targetSets: number,
  targetReps: number,
) {
  const checkedSets = previousRecord.sets
    .slice()
    .sort((left, right) => left.setNumber - right.setNumber)
    .slice(0, targetSets);

  return (
    checkedSets.length >= targetSets &&
    checkedSets.every((set) => set.reps >= targetReps)
  );
}

function getNextTarget(
  previousWeightKg: number | null,
  previousTargetReps: number,
  exercise: AssignmentRoutineExercise,
  trainingGoal: string,
  wasCompleted: boolean,
) {
  if (!wasCompleted) {
    return {
      targetWeightKg: previousWeightKg,
      targetReps: previousTargetReps,
      reason: '지난 목표를 먼저 채우는 방향입니다.',
    };
  }

  if (exercise.equipmentType === 'bodyweight') {
    return {
      targetWeightKg: null,
      targetReps: previousTargetReps + 1,
      reason: '체중 운동은 반복 수를 1회 늘립니다.',
    };
  }

  const normalizedGoal = trainingGoal.trim().toLowerCase();

  if (normalizedGoal === 'endurance') {
    return {
      targetWeightKg: previousWeightKg,
      targetReps: previousTargetReps + 2,
      reason: '근지구력 목표라 반복 수를 늘립니다.',
    };
  }

  if (normalizedGoal === 'hypertrophy' && previousTargetReps < 12) {
    return {
      targetWeightKg: previousWeightKg,
      targetReps: previousTargetReps + 1,
      reason: '근비대 목표라 먼저 반복 수를 채웁니다.',
    };
  }

  return {
    targetWeightKg: addWeight(previousWeightKg, exercise.equipmentType),
    targetReps: exercise.targetReps,
    reason: '지난 목표를 채워서 무게를 조금 올립니다.',
  };
}

function addWeight(weightKg: number | null, equipmentType: string) {
  if (weightKg === null) {
    return null;
  }

  if (equipmentType === 'dumbbell') {
    return weightKg + 1;
  }

  return weightKg + 2.5;
}

function buildCoachNote(
  exercise: AssignmentRoutineExercise,
  wasCompleted: boolean,
  reason: string,
) {
  const baseNote = exercise.coachNote ?? '오늘 목표를 차분히 수행합니다.';

  if (!wasCompleted) {
    return `${baseNote} ${reason}`;
  }

  return `${baseNote} 지난 목표를 달성했으니 이번에는 한 단계만 올려봅니다. ${reason}`;
}
