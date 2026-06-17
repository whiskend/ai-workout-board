import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CoachService } from './coach.service';

type AuthenticatedRequest = Request & {
  user: {
    id: number;
    email: string;
    nickname: string;
  };
};

@Controller('coach')
export class CoachController {
  constructor(private readonly coachService: CoachService) {}

  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  getDashboard(@Req() request: AuthenticatedRequest) {
    return this.coachService.getDashboard(request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('assignments/today')
  getTodayAssignment(@Req() request: AuthenticatedRequest) {
    return this.coachService.getTodayAssignment(request.user.id);
  }
}

