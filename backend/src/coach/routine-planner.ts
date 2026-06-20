import {
  CANDIDATE_META,
  EXERCISE_TEMPLATES,
  EXPERIENCE_ORDER,
  type ExerciseTemplate,
} from './routine-catalog';
import {
  ROUTINE_CANDIDATE_KEYS,
  buildDayLabels,
  normalizeExperience,
  type OnboardingPlanInput,
  type RoutineCandidateKey,
  type RoutineCandidateResult,
  type RoutineDayPlan,
  type RoutineExercisePlan,
} from './routine-types';

export function buildRoutineCandidates(
  profile: OnboardingPlanInput,
): RoutineCandidateResult {
  const dayLabels = buildDayLabels(profile.splitType);
  const recommendedCandidateKey = getRecommendedCandidateKey(profile);

  const candidates = ROUTINE_CANDIDATE_KEYS.map((key) => ({
    key,
    ...CANDIDATE_META[key],
    recommendationReason: buildRecommendationReason(key, profile),
    isRecommended: key === recommendedCandidateKey,
    days: dayLabels.map((label, dayIndex) =>
      buildRoutineDay(label, dayIndex, key, profile),
    ),
  }));

  return {
    candidates,
    recommendedCandidateKey,
  };
}

function buildRoutineDay(
  label: string,
  dayIndex: number,
  candidateKey: RoutineCandidateKey,
  profile: OnboardingPlanInput,
): RoutineDayPlan {
  const templates = selectTemplates(label, candidateKey, profile).slice(
    0,
    getExerciseCount(profile.availableMinutes),
  );

  return {
    dayIndex,
    label,
    exercises: templates.map((template, orderIndex) =>
      buildExercisePlan(template, orderIndex, profile),
    ),
  };
}

function selectTemplates(
  dayLabel: string,
  candidateKey: RoutineCandidateKey,
  profile: OnboardingPlanInput,
): readonly ExerciseTemplate[] {
  const availableEquipment = new Set(profile.availableEquipment);
  const experienceLevel = normalizeExperience(profile.experienceLevel);
  const experienceRank = EXPERIENCE_ORDER[experienceLevel];
  const priority = getEquipmentPriority(candidateKey);

  return EXERCISE_TEMPLATES.filter(
    (template) =>
      template.dayTags.includes(dayLabel) &&
      template.candidateFit.includes(candidateKey) &&
      availableEquipment.has(template.equipmentName) &&
      EXPERIENCE_ORDER[template.minExperience] <= experienceRank,
  ).sort(
    (left, right) =>
      priority.indexOf(left.equipmentType) - priority.indexOf(right.equipmentType),
  );
}

function buildExercisePlan(
  template: ExerciseTemplate,
  orderIndex: number,
  profile: OnboardingPlanInput,
): RoutineExercisePlan {
  const experienceLevel = normalizeExperience(profile.experienceLevel);
  const target = getGoalTarget(profile.trainingGoal, profile.availableMinutes);

  return {
    exerciseName: template.exerciseName,
    normalizedName: template.normalizedName,
    equipmentType: template.equipmentType,
    targetSets: target.targetSets,
    targetReps: target.targetReps,
    baseWeightKg: template.baseWeightKgByExperience[experienceLevel],
    orderIndex,
    coachNote: template.coachNote,
  };
}

function getGoalTarget(trainingGoal: string, availableMinutes: number) {
  const targetSets = availableMinutes <= 30 ? 2 : 3;
  const normalizedGoal = trainingGoal.trim().toLowerCase();

  if (normalizedGoal === 'strength') {
    return { targetSets: availableMinutes <= 30 ? 3 : 4, targetReps: 5 };
  }

  if (normalizedGoal === 'endurance') {
    return { targetSets, targetReps: 15 };
  }

  return { targetSets, targetReps: 10 };
}

function getExerciseCount(availableMinutes: number) {
  if (availableMinutes <= 30) {
    return 3;
  }

  if (availableMinutes <= 45) {
    return 4;
  }

  return 5;
}

function getRecommendedCandidateKey(
  profile: OnboardingPlanInput,
): RoutineCandidateKey {
  const experienceLevel = normalizeExperience(profile.experienceLevel);

  if (experienceLevel === 'beginner' || profile.availableMinutes <= 30) {
    return 'stable';
  }

  if (experienceLevel === 'advanced' && profile.availableMinutes >= 60) {
    return 'challenge';
  }

  return 'growth';
}

function buildRecommendationReason(
  candidateKey: RoutineCandidateKey,
  profile: OnboardingPlanInput,
) {
  const recommendedCandidateKey = getRecommendedCandidateKey(profile);

  if (candidateKey !== recommendedCandidateKey) {
    return '조건에 맞는 선택지 중 하나입니다. 운동 취향에 맞으면 선택해도 됩니다.';
  }

  if (candidateKey === 'stable') {
    return '운동 시간을 아끼면서 자세와 기록 습관을 먼저 만들기 좋습니다.';
  }

  if (candidateKey === 'challenge') {
    return '운동 경험과 시간이 충분해서 조금 더 도전적인 구성을 추천합니다.';
  }

  return '기록 향상과 루틴 지속성의 균형이 좋아 현재 조건에 가장 무난합니다.';
}

function getEquipmentPriority(
  candidateKey: RoutineCandidateKey,
): readonly string[] {
  if (candidateKey === 'stable') {
    return ['smith', 'lat_pulldown', 'cable', 'dumbbell', 'bodyweight'];
  }

  if (candidateKey === 'challenge') {
    return ['dumbbell', 'bodyweight', 'smith', 'lat_pulldown', 'cable'];
  }

  return ['dumbbell', 'smith', 'lat_pulldown', 'cable', 'bodyweight'];
}
