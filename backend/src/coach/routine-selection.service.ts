import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { routineCycleInclude } from './coach-query';
import { buildRoutineCandidates } from './routine-planner';
import { isRoutineCandidateKey } from './routine-types';

@Injectable()
export class RoutineSelectionService {
  constructor(private readonly prisma: PrismaService) {}

  async getRoutineCandidates(userId: number) {
    const [profile, routineCycle] = await this.prisma.$transaction([
      this.prisma.onboardingProfile.findUnique({
        where: { userId },
      }),
      this.prisma.routineCycle.findUnique({
        where: { userId },
      }),
    ]);

    if (!profile) {
      throw new NotFoundException('코치 설정을 먼저 완료해야 합니다.');
    }

    return {
      ...buildRoutineCandidates(profile),
      selectedCandidateKey: routineCycle?.selectedCandidateKey ?? null,
    };
  }

  async selectRoutineCandidate(userId: number, candidateKey: string) {
    if (!isRoutineCandidateKey(candidateKey)) {
      throw new BadRequestException('알 수 없는 루틴 후보입니다.');
    }

    const profile = await this.prisma.onboardingProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('코치 설정을 먼저 완료해야 합니다.');
    }

    const candidate = buildRoutineCandidates(profile).candidates.find(
      (routineCandidate) => routineCandidate.key === candidateKey,
    );

    if (!candidate) {
      throw new BadRequestException('선택할 수 없는 루틴 후보입니다.');
    }

    const selectedAt = new Date();
    const routineDays = {
      create: candidate.days.map((day) => ({
        dayIndex: day.dayIndex,
        label: day.label,
        exercises: {
          create: day.exercises.map((exercise) => ({
            exerciseName: exercise.exerciseName,
            normalizedName: exercise.normalizedName,
            equipmentType: exercise.equipmentType,
            targetSets: exercise.targetSets,
            targetReps: exercise.targetReps,
            baseWeightKg: exercise.baseWeightKg,
            orderIndex: exercise.orderIndex,
            coachNote: exercise.coachNote,
          })),
        },
      })),
    };

    return this.prisma.routineCycle.upsert({
      where: { userId },
      update: {
        splitType: profile.splitType,
        dayLabels: candidate.days.map((day) => day.label),
        currentDayIndex: 0,
        selectedCandidateKey: candidate.key,
        selectedCandidateName: candidate.name,
        selectedCandidateDescription: candidate.description,
        selectedAt,
        routineDays: {
          deleteMany: {},
          ...routineDays,
        },
      },
      create: {
        userId,
        splitType: profile.splitType,
        dayLabels: candidate.days.map((day) => day.label),
        currentDayIndex: 0,
        selectedCandidateKey: candidate.key,
        selectedCandidateName: candidate.name,
        selectedCandidateDescription: candidate.description,
        selectedAt,
        routineDays,
      },
      include: routineCycleInclude,
    });
  }
}
