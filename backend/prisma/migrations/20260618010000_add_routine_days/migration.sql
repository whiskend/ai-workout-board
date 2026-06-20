ALTER TABLE "RoutineCycle"
ADD COLUMN "selectedCandidateKey" TEXT,
ADD COLUMN "selectedCandidateName" TEXT,
ADD COLUMN "selectedCandidateDescription" TEXT,
ADD COLUMN "selectedAt" TIMESTAMP(3);

CREATE TABLE "RoutineDay" (
    "id" SERIAL NOT NULL,
    "routineCycleId" INTEGER NOT NULL,
    "dayIndex" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoutineDay_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RoutineExercise" (
    "id" SERIAL NOT NULL,
    "routineDayId" INTEGER NOT NULL,
    "exerciseName" TEXT NOT NULL,
    "normalizedName" TEXT NOT NULL,
    "equipmentType" TEXT NOT NULL,
    "targetSets" INTEGER NOT NULL,
    "targetReps" INTEGER NOT NULL,
    "baseWeightKg" DOUBLE PRECISION,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "coachNote" TEXT,

    CONSTRAINT "RoutineExercise_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "RoutineDay_routineCycleId_dayIndex_key" ON "RoutineDay"("routineCycleId", "dayIndex");

CREATE INDEX "RoutineDay_routineCycleId_idx" ON "RoutineDay"("routineCycleId");

CREATE INDEX "RoutineExercise_routineDayId_idx" ON "RoutineExercise"("routineDayId");

CREATE INDEX "RoutineExercise_normalizedName_idx" ON "RoutineExercise"("normalizedName");

CREATE INDEX "RoutineExercise_equipmentType_idx" ON "RoutineExercise"("equipmentType");

ALTER TABLE "RoutineDay" ADD CONSTRAINT "RoutineDay_routineCycleId_fkey" FOREIGN KEY ("routineCycleId") REFERENCES "RoutineCycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "RoutineExercise" ADD CONSTRAINT "RoutineExercise_routineDayId_fkey" FOREIGN KEY ("routineDayId") REFERENCES "RoutineDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;
