export const ROUTINE_CANDIDATE_KEYS = [
  'stable',
  'growth',
  'challenge',
] as const;

export type RoutineCandidateKey = (typeof ROUTINE_CANDIDATE_KEYS)[number];
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type OnboardingPlanInput = {
  readonly availableEquipment: readonly string[];
  readonly trainingGoal: string;
  readonly availableMinutes: number;
  readonly splitType: string;
  readonly experienceLevel: string;
};

export type RoutineExercisePlan = {
  readonly exerciseName: string;
  readonly normalizedName: string;
  readonly equipmentType: string;
  readonly targetSets: number;
  readonly targetReps: number;
  readonly baseWeightKg: number | null;
  readonly orderIndex: number;
  readonly coachNote: string;
};

export type RoutineDayPlan = {
  readonly dayIndex: number;
  readonly label: string;
  readonly exercises: readonly RoutineExercisePlan[];
};

export type RoutineCandidate = {
  readonly key: RoutineCandidateKey;
  readonly name: string;
  readonly summary: string;
  readonly description: string;
  readonly recommendationReason: string;
  readonly isRecommended: boolean;
  readonly days: readonly RoutineDayPlan[];
};

export type RoutineCandidateResult = {
  readonly candidates: readonly RoutineCandidate[];
  readonly recommendedCandidateKey: RoutineCandidateKey;
};

export function buildDayLabels(splitType: string): readonly string[] {
  const normalizedSplitType = splitType.trim().toLowerCase();

  if (normalizedSplitType === 'two_split') {
    return ['상체', '하체'];
  }

  if (normalizedSplitType === 'three_split') {
    return ['밀기', '당기기', '하체'];
  }

  if (normalizedSplitType === 'four_split') {
    return ['가슴/삼두', '등/이두', '하체', '어깨'];
  }

  return ['전신'];
}

export function isRoutineCandidateKey(
  value: string,
): value is RoutineCandidateKey {
  return value === 'stable' || value === 'growth' || value === 'challenge';
}

export function normalizeExperience(experienceLevel: string): ExperienceLevel {
  const normalizedExperience = experienceLevel.trim().toLowerCase();

  if (
    normalizedExperience === 'intermediate' ||
    normalizedExperience === 'advanced'
  ) {
    return normalizedExperience;
  }

  return 'beginner';
}
