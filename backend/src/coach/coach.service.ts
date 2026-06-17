import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const assignmentInclude = {
  exercises: {
    orderBy: {
      orderIndex: 'asc' as const,
    },
    include: {
      sets: {
        orderBy: {
          setNumber: 'asc' as const,
        },
      },
    },
  },
};

const logInclude = {
  exercises: {
    orderBy: {
      orderIndex: 'asc' as const,
    },
    include: {
      sets: {
        orderBy: {
          setNumber: 'asc' as const,
        },
      },
    },
  },
};

function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
}

@Injectable()
export class CoachService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(userId: number) {
    const { start, end } = getTodayRange();
    const [profile, routineCycle, todayAssignment, recentLogs] =
      await this.prisma.$transaction([
        this.prisma.onboardingProfile.findUnique({
          where: { userId },
        }),
        this.prisma.routineCycle.findUnique({
          where: { userId },
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
        : todayAssignment
          ? 'start_assignment'
          : 'generate_assignment',
    };
  }

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
}

