import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOnboardingProfileDto } from './dto/create-onboarding-profile.dto';

function normalizeList(values: string[]) {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter(Boolean)),
  );
}

function buildDayLabels(splitType: string) {
  const normalizedSplitType = splitType.trim().toLowerCase();

  if (normalizedSplitType === 'two_split') {
    return ['상체', '하체'];
  }

  if (normalizedSplitType === 'three_split') {
    return ['밀기', '당기기', '하체'];
  }

  if (normalizedSplitType === 'four_split') {
    return ['가슴/삼두', '등/이두', '하체', '어깨'];
  }

  return ['전신'];
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
    const dayLabels = buildDayLabels(splitType);

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

