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
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
  exercises: WorkoutLogExercise[];
};

export type CoachNextAction =
  | 'complete_onboarding'
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
