import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CoachAssignmentService } from './coach-assignment.service';
import type { CompleteAssignmentDto } from './dto/complete-assignment.dto';
import {
  assignmentInclude,
  getTodayRange,
  logInclude,
  routineCycleInclude,
} from './coach-query';
import { RoutineSelectionService } from './routine-selection.service';
import { WorkoutLogService } from './workout-log.service';

@Injectable()
export class CoachService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly routineSelectionService: RoutineSelectionService,
    private readonly coachAssignmentService: CoachAssignmentService,
    private readonly workoutLogService: WorkoutLogService,
  ) {}

  async getDashboard(userId: number) {
    const { start, end } = getTodayRange();
    const [profile, routineCycle, todayAssignment, recentLogs] =
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
        this.prisma.workoutLog.findMany({
          where: { userId },
          orderBy: {
            workoutDate: 'desc',
          },
          take: 3,
          include: logInclude,
        }),
      ]);

    return {
      profile,
      routineCycle,
      todayAssignment,
      recentLogs,
      nextAction: !profile
        ? 'complete_onboarding'
        : !routineCycle?.selectedCandidateKey
          ? 'select_routine'
        : todayAssignment
          ? 'start_assignment'
          : 'generate_assignment',
    };
  }

  getRoutineCandidates(userId: number) {
    return this.routineSelectionService.getRoutineCandidates(userId);
  }

  selectRoutineCandidate(userId: number, candidateKey: string) {
    return this.routineSelectionService.selectRoutineCandidate(
      userId,
      candidateKey,
    );
  }

  getTodayAssignment(userId: number) {
    return this.coachAssignmentService.getTodayAssignment(userId);
  }

  getAssignment(userId: number, assignmentId: number) {
    return this.coachAssignmentService.getAssignment(userId, assignmentId);
  }

  createTodayAssignment(userId: number) {
    return this.coachAssignmentService.createTodayAssignment(userId);
  }

  completeAssignment(
    userId: number,
    assignmentId: number,
    completeAssignmentDto: CompleteAssignmentDto,
  ) {
    return this.workoutLogService.completeAssignment(
      userId,
      assignmentId,
      completeAssignmentDto,
    );
  }
}
