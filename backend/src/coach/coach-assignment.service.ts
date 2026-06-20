import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  buildAssignmentExercisePlans,
  type AssignmentRoutineExercise,
  type PreviousExerciseRecord,
} from './assignment-planner';
import { assignmentInclude, getTodayRange, routineCycleInclude } from './coach-query';

@Injectable()
export class CoachAssignmentService {
  constructor(private readonly prisma: PrismaService) {}

  getTodayAssignment(userId: number) {
    const { start, end } = getTodayRange();

    return this.prisma.workoutAssignment.findFirst({
      where: {
        userId,
        scheduledDate: {
          gte: start,
          lt: end,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: assignmentInclude,
    });
  }

  async getAssignment(userId: number, assignmentId: number) {
    const assignment = await this.prisma.workoutAssignment.findFirst({
      where: {
        id: assignmentId,
        userId,
      },
      include: assignmentInclude,
    });

    if (!assignment) {
      throw new NotFoundException('운동 과제를 찾을 수 없습니다.');
    }

    return assignment;
  }

  async createTodayAssignment(userId: number) {
    const { start, end } = getTodayRange();
    const [profile, routineCycle, existingAssignment] =
      await this.prisma.$transaction([
        this.prisma.onboardingProfile.findUnique({
          where: { userId },
        }),
        this.prisma.routineCycle.findUnique({
          where: { userId },
          include: routineCycleInclude,
        }),
        this.prisma.workoutAssignment.findFirst({
          where: {
            userId,
            scheduledDate: {
              gte: start,
              lt: end,
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          include: assignmentInclude,
        }),
      ]);

    if (!profile) {
      throw new NotFoundException('코치 설정을 먼저 완료해야 합니다.');
    }

    if (existingAssignment) {
      return existingAssignment;
    }

    if (!routineCycle?.selectedCandidateKey) {
      throw new BadRequestException('루틴 후보를 먼저 선택해야 합니다.');
    }

    const currentDay =
      routineCycle.routineDays.find(
        (day) => day.dayIndex === routineCycle.currentDayIndex,
      ) ?? routineCycle.routineDays[0];

    if (!currentDay || currentDay.exercises.length === 0) {
      throw new BadRequestException('선택한 루틴에 운동이 없습니다.');
    }

    const routineExercises = currentDay.exercises.map((exercise) => ({
      exerciseName: exercise.exerciseName,
      normalizedName: exercise.normalizedName,
      equipmentType: exercise.equipmentType,
      targetSets: exercise.targetSets,
      targetReps: exercise.targetReps,
      baseWeightKg: exercise.baseWeightKg,
      orderIndex: exercise.orderIndex,
      coachNote: exercise.coachNote,
    })) satisfies readonly AssignmentRoutineExercise[];
    const previousRecords = await this.getPreviousExerciseRecords(
      userId,
      routineExercises.map((exercise) => exercise.normalizedName),
    );
    const assignmentExercises = buildAssignmentExercisePlans(
      routineExercises,
      previousRecords,
      profile.trainingGoal,
    );

    return this.prisma.workoutAssignment.create({
      data: {
        userId,
        routineCycleId: routineCycle.id,
        splitDayIndex: currentDay.dayIndex,
        title: `${currentDay.label} 운동 과제`,
        scheduledDate: start,
        status: 'planned',
        exercises: {
          create: assignmentExercises.map((exercise) => ({
            exerciseName: exercise.exerciseName,
            normalizedName: exercise.normalizedName,
            targetWeightKg: exercise.targetWeightKg,
            targetSets: exercise.targetSets,
            targetReps: exercise.targetReps,
            orderIndex: exercise.orderIndex,
            coachNote: exercise.coachNote,
            sets: {
              create: exercise.sets.map((set) => ({
                setNumber: set.setNumber,
                targetWeightKg: set.targetWeightKg,
                targetReps: set.targetReps,
              })),
            },
          })),
        },
      },
      include: assignmentInclude,
    });
  }

  private async getPreviousExerciseRecords(
    userId: number,
    normalizedNames: readonly string[],
  ): Promise<readonly PreviousExerciseRecord[]> {
    if (normalizedNames.length === 0) {
      return [];
    }

    const exercises = await this.prisma.exercise.findMany({
      where: {
        post: {
          authorId: userId,
        },
        OR: [
          {
            normalizedName: {
              in: [...normalizedNames],
            },
          },
          {
            exerciseName: {
              in: [...normalizedNames],
            },
          },
        ],
      },
      orderBy: {
        id: 'desc',
      },
      take: normalizedNames.length * 5,
      include: {
        sets: {
          orderBy: {
            setNumber: 'asc',
          },
        },
      },
    });

    const previousByName = new Map<string, PreviousExerciseRecord>();

    for (const exercise of exercises) {
      const normalizedName =
        exercise.normalizedName ?? exercise.exerciseName.trim().toLowerCase();

      if (previousByName.has(normalizedName)) {
        continue;
      }

      previousByName.set(normalizedName, {
        normalizedName,
        weightKg: exercise.weightKg,
        targetReps: exercise.targetReps,
        sets: exercise.sets.map((set) => ({
          setNumber: set.setNumber,
          reps: set.reps,
        })),
      });
    }

    return Array.from(previousByName.values());
  }
}
