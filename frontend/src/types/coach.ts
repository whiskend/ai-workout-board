export type OnboardingProfile = {
  id: number;
  userId: number;
  availableEquipment: string[];
  trainingGoal: string;
  availableMinutes: number;
  splitType: string;
  experienceLevel: string;
  createdAt: string;
  updatedAt: string;
};

export type RoutineCycle = {
  id: number;
  userId: number;
  splitType: string;
  dayLabels: string[];
  currentDayIndex: number;
  selectedCandidateKey?: string | null;
  selectedCandidateName?: string | null;
  selectedCandidateDescription?: string | null;
  selectedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  routineDays?: RoutineDay[];
};

export type RoutineExercise = {
  id: number;
  routineDayId: number;
  exerciseName: string;
  normalizedName: string;
  equipmentType: string;
  targetSets: number;
  targetReps: number;
  baseWeightKg?: number | null;
  orderIndex: number;
  coachNote?: string | null;
};

export type RoutineDay = {
  id: number;
  routineCycleId: number;
  dayIndex: number;
  label: string;
  createdAt: string;
  updatedAt: string;
  exercises: RoutineExercise[];
};

export type RoutineCandidateExercise = {
  exerciseName: string;
  normalizedName: string;
  equipmentType: string;
  targetSets: number;
  targetReps: number;
  baseWeightKg?: number | null;
  orderIndex: number;
  coachNote: string;
};

export type RoutineCandidateDay = {
  dayIndex: number;
  label: string;
  exercises: RoutineCandidateExercise[];
};

export type RoutineCandidate = {
  key: string;
  name: string;
  summary: string;
  description: string;
  recommendationReason: string;
  isRecommended: boolean;
  days: RoutineCandidateDay[];
};

export type RoutineCandidatesResponse = {
  candidates: RoutineCandidate[];
  recommendedCandidateKey: string;
  selectedCandidateKey?: string | null;
};

export type WorkoutAssignmentSet = {
  id: number;
  assignmentExerciseId: number;
  setNumber: number;
  targetWeightKg?: number | null;
  targetReps?: number | null;
};

export type WorkoutAssignmentExercise = {
  id: number;
  assignmentId: number;
  exerciseName: string;
  normalizedName?: string | null;
  targetWeightKg?: number | null;
  targetSets: number;
  targetReps?: number | null;
  orderIndex: number;
  coachNote?: string | null;
  sets: WorkoutAssignmentSet[];
};

export type WorkoutAssignment = {
  id: number;
  userId: number;
  routineCycleId?: number | null;
  splitDayIndex: number;
  title: string;
  scheduledDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  exercises: WorkoutAssignmentExercise[];
};

export type WorkoutLogSet = {
  id: number;
  workoutLogExerciseId: number;
  setNumber: number;
  weightKg?: number | null;
  reps: number;
  perceivedDifficulty?: number | null;
};

export type WorkoutLogExercise = {
  id: number;
  workoutLogId: number;
  exerciseName: string;
  normalizedName?: string | null;
  orderIndex: number;
  memo?: string | null;
  sets: WorkoutLogSet[];
};

export type WorkoutLog = {
  id: number;
  userId: number;
  assignmentId?: number | null;
  workoutDate: string;
  bodyPart?: string | null;
  memo?: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  exercises: WorkoutLogExercise[];
};

export type CompleteAssignmentSetRequest = {
  assignmentSetId: number;
  weightKg?: number | null;
  reps: number;
  perceivedDifficulty?: number | null;
};

export type CompleteAssignmentExerciseRequest = {
  assignmentExerciseId: number;
  memo?: string;
  sets: CompleteAssignmentSetRequest[];
};

export type CompleteAssignmentRequest = {
  memo?: string;
  isPublic?: boolean;
  exercises: CompleteAssignmentExerciseRequest[];
};

export type CoachNextAction =
  | 'complete_onboarding'
  | 'select_routine'
  | 'start_assignment'
  | 'generate_assignment';

export type CoachDashboard = {
  profile: OnboardingProfile | null;
  routineCycle: RoutineCycle | null;
  todayAssignment: WorkoutAssignment | null;
  recentLogs: WorkoutLog[];
  nextAction: CoachNextAction;
};

export type CreateOnboardingProfileRequest = {
  availableEquipment: string[];
  trainingGoal: string;
  availableMinutes: number;
  splitType: string;
  experienceLevel: string;
};

export type UpsertOnboardingProfileResponse = {
  profile: OnboardingProfile;
  routineCycle: RoutineCycle;
};
