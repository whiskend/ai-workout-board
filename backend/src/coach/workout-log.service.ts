import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { assignmentInclude, logInclude } from './coach-query';
import { CompleteAssignmentDto } from './dto/complete-assignment.dto';

const assignmentCompletionInclude = {
  ...assignmentInclude,
  workoutLog: true,
};

@Injectable()
export class WorkoutLogService {
  constructor(private readonly prisma: PrismaService) {}

  async completeAssignment(
    userId: number,
    assignmentId: number,
    completeAssignmentDto: CompleteAssignmentDto,
  ) {
    const assignment = await this.prisma.workoutAssignment.findFirst({
      where: {
        id: assignmentId,
        userId,
      },
      include: assignmentCompletionInclude,
    });

    if (!assignment) {
      throw new NotFoundException('운동 과제를 찾을 수 없습니다.');
    }

    if (assignment.workoutLog) {
      return this.prisma.workoutLog.findUnique({
        where: {
          id: assignment.workoutLog.id,
        },
        include: logInclude,
      });
    }

    const exerciseById = new Map(
      assignment.exercises.map((exercise) => [exercise.id, exercise]),
    );
    const requestedExerciseIds = new Set<number>();

    return this.prisma.$transaction(async (tx) => {
      const workoutLog = await tx.workoutLog.create({
        data: {
          userId,
          assignmentId: assignment.id,
          workoutDate: new Date(),
          bodyPart: assignment.title,
          memo: normalizeMemo(completeAssignmentDto.memo),
          isPublic: completeAssignmentDto.isPublic ?? true,
          exercises: {
            create: completeAssignmentDto.exercises.map((exerciseDto) => {
              const assignmentExercise = exerciseById.get(
                exerciseDto.assignmentExerciseId,
              );

              if (!assignmentExercise) {
                throw new BadRequestException('과제에 없는 운동입니다.');
              }

              if (requestedExerciseIds.has(assignmentExercise.id)) {
                throw new BadRequestException('운동 기록이 중복되었습니다.');
              }

              requestedExerciseIds.add(assignmentExercise.id);

              const assignmentSetById = new Map(
                assignmentExercise.sets.map((set) => [set.id, set]),
              );
              const requestedSetIds = new Set<number>();

              return {
                exerciseName: assignmentExercise.exerciseName,
                normalizedName: assignmentExercise.normalizedName,
                orderIndex: assignmentExercise.orderIndex,
                memo: normalizeMemo(exerciseDto.memo),
                sets: {
                  create: exerciseDto.sets.map((setDto) => {
                    const assignmentSet = assignmentSetById.get(
                      setDto.assignmentSetId,
                    );

                    if (!assignmentSet) {
                      throw new BadRequestException('과제에 없는 세트입니다.');
                    }

                    if (requestedSetIds.has(assignmentSet.id)) {
                      throw new BadRequestException('세트 기록이 중복되었습니다.');
                    }

                    requestedSetIds.add(assignmentSet.id);

                    return {
                      setNumber: assignmentSet.setNumber,
                      weightKg: setDto.weightKg ?? assignmentSet.targetWeightKg,
                      reps: setDto.reps,
                      perceivedDifficulty: setDto.perceivedDifficulty,
                    };
                  }),
                },
              };
            }),
          },
        },
      });

      await tx.workoutAssignment.update({
        where: {
          id: assignment.id,
        },
        data: {
          status: 'completed',
        },
      });

      return tx.workoutLog.findUnique({
        where: {
          id: workoutLog.id,
        },
        include: logInclude,
      });
    });
  }
}

function normalizeMemo(memo?: string | null) {
  const trimmed = memo?.trim();

  return trimmed ? trimmed : null;
}
