import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { buildDayLabels } from '../coach/routine-types';
import { CreateOnboardingProfileDto } from './dto/create-onboarding-profile.dto';

function normalizeList(values: string[]) {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter(Boolean)),
  );
}

@Injectable()
export class OnboardingService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertProfile(userId: number, dto: CreateOnboardingProfileDto) {
    const availableEquipment = normalizeList(dto.availableEquipment);
    const splitType = dto.splitType.trim().toLowerCase();
    const profileData = {
      availableEquipment,
      trainingGoal: dto.trainingGoal.trim().toLowerCase(),
      availableMinutes: dto.availableMinutes,
      splitType,
      experienceLevel: dto.experienceLevel.trim().toLowerCase(),
    };
    const dayLabels = [...buildDayLabels(splitType)];

    const [profile, routineCycle] = await this.prisma.$transaction([
      this.prisma.onboardingProfile.upsert({
        where: { userId },
        update: profileData,
        create: {
          userId,
          ...profileData,
        },
      }),
      this.prisma.routineCycle.upsert({
        where: { userId },
        update: {
          splitType,
          dayLabels,
          currentDayIndex: 0,
          selectedCandidateKey: null,
          selectedCandidateName: null,
          selectedCandidateDescription: null,
          selectedAt: null,
          routineDays: {
            deleteMany: {},
          },
        },
        create: {
          userId,
          splitType,
          dayLabels,
        },
      }),
    ]);

    return {
      profile,
      routineCycle,
    };
  }

  getMyProfile(userId: number) {
    return this.prisma.onboardingProfile.findUnique({
      where: { userId },
    });
  }
}
