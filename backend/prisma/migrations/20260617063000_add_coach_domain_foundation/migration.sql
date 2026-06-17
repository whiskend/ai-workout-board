CREATE TABLE "OnboardingProfile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "availableEquipment" TEXT[],
    "trainingGoal" TEXT NOT NULL,
    "availableMinutes" INTEGER NOT NULL,
    "splitType" TEXT NOT NULL,
    "experienceLevel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnboardingProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RoutineCycle" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "splitType" TEXT NOT NULL,
    "dayLabels" TEXT[],
    "currentDayIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoutineCycle_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WorkoutAssignment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "routineCycleId" INTEGER,
    "splitDayIndex" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkoutAssignment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WorkoutAssignmentExercise" (
    "id" SERIAL NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "exerciseName" TEXT NOT NULL,
    "normalizedName" TEXT,
    "targetWeightKg" DOUBLE PRECISION,
    "targetSets" INTEGER NOT NULL,
    "targetReps" INTEGER,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "coachNote" TEXT,

    CONSTRAINT "WorkoutAssignmentExercise_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WorkoutAssignmentSet" (
    "id" SERIAL NOT NULL,
    "assignmentExerciseId" INTEGER NOT NULL,
    "setNumber" INTEGER NOT NULL,
    "targetWeightKg" DOUBLE PRECISION,
    "targetReps" INTEGER,

    CONSTRAINT "WorkoutAssignmentSet_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WorkoutLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "assignmentId" INTEGER,
    "workoutDate" TIMESTAMP(3) NOT NULL,
    "bodyPart" TEXT,
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkoutLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WorkoutLogExercise" (
    "id" SERIAL NOT NULL,
    "workoutLogId" INTEGER NOT NULL,
    "exerciseName" TEXT NOT NULL,
    "normalizedName" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "memo" TEXT,

    CONSTRAINT "WorkoutLogExercise_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WorkoutLogSet" (
    "id" SERIAL NOT NULL,
    "workoutLogExerciseId" INTEGER NOT NULL,
    "setNumber" INTEGER NOT NULL,
    "weightKg" DOUBLE PRECISION,
    "reps" INTEGER NOT NULL,
    "perceivedDifficulty" INTEGER,

    CONSTRAINT "WorkoutLogSet_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "OnboardingProfile_userId_key" ON "OnboardingProfile"("userId");

CREATE UNIQUE INDEX "RoutineCycle_userId_key" ON "RoutineCycle"("userId");

CREATE INDEX "WorkoutAssignment_userId_idx" ON "WorkoutAssignment"("userId");

CREATE INDEX "WorkoutAssignment_routineCycleId_idx" ON "WorkoutAssignment"("routineCycleId");

CREATE INDEX "WorkoutAssignment_scheduledDate_idx" ON "WorkoutAssignment"("scheduledDate");

CREATE INDEX "WorkoutAssignment_status_idx" ON "WorkoutAssignment"("status");

CREATE INDEX "WorkoutAssignmentExercise_assignmentId_idx" ON "WorkoutAssignmentExercise"("assignmentId");

CREATE INDEX "WorkoutAssignmentExercise_normalizedName_idx" ON "WorkoutAssignmentExercise"("normalizedName");

CREATE INDEX "WorkoutAssignmentSet_assignmentExerciseId_idx" ON "WorkoutAssignmentSet"("assignmentExerciseId");

CREATE UNIQUE INDEX "WorkoutLog_assignmentId_key" ON "WorkoutLog"("assignmentId");

CREATE INDEX "WorkoutLog_userId_idx" ON "WorkoutLog"("userId");

CREATE INDEX "WorkoutLog_workoutDate_idx" ON "WorkoutLog"("workoutDate");

CREATE INDEX "WorkoutLog_bodyPart_idx" ON "WorkoutLog"("bodyPart");

CREATE INDEX "WorkoutLogExercise_workoutLogId_idx" ON "WorkoutLogExercise"("workoutLogId");

CREATE INDEX "WorkoutLogExercise_normalizedName_idx" ON "WorkoutLogExercise"("normalizedName");

CREATE INDEX "WorkoutLogSet_workoutLogExerciseId_idx" ON "WorkoutLogSet"("workoutLogExerciseId");

ALTER TABLE "OnboardingProfile" ADD CONSTRAINT "OnboardingProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "RoutineCycle" ADD CONSTRAINT "RoutineCycle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WorkoutAssignment" ADD CONSTRAINT "WorkoutAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WorkoutAssignment" ADD CONSTRAINT "WorkoutAssignment_routineCycleId_fkey" FOREIGN KEY ("routineCycleId") REFERENCES "RoutineCycle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "WorkoutAssignmentExercise" ADD CONSTRAINT "WorkoutAssignmentExercise_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "WorkoutAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WorkoutAssignmentSet" ADD CONSTRAINT "WorkoutAssignmentSet_assignmentExerciseId_fkey" FOREIGN KEY ("assignmentExerciseId") REFERENCES "WorkoutAssignmentExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WorkoutLog" ADD CONSTRAINT "WorkoutLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WorkoutLog" ADD CONSTRAINT "WorkoutLog_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "WorkoutAssignment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "WorkoutLogExercise" ADD CONSTRAINT "WorkoutLogExercise_workoutLogId_fkey" FOREIGN KEY ("workoutLogId") REFERENCES "WorkoutLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WorkoutLogSet" ADD CONSTRAINT "WorkoutLogSet_workoutLogExerciseId_fkey" FOREIGN KEY ("workoutLogExerciseId") REFERENCES "WorkoutLogExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
