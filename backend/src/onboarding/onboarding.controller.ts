import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateOnboardingProfileDto } from './dto/create-onboarding-profile.dto';
import { OnboardingService } from './onboarding.service';

type AuthenticatedRequest = Request & {
  user: {
    id: number;
    email: string;
    nickname: string;
  };
};

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  upsertProfile(
    @Req() request: AuthenticatedRequest,
    @Body() createOnboardingProfileDto: CreateOnboardingProfileDto,
  ) {
    return this.onboardingService.upsertProfile(
      request.user.id,
      createOnboardingProfileDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyProfile(@Req() request: AuthenticatedRequest) {
    return this.onboardingService.getMyProfile(request.user.id);
  }
}

