import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CoachService } from './coach.service';
import { CompleteAssignmentDto } from './dto/complete-assignment.dto';
import { SelectRoutineCandidateDto } from './dto/select-routine-candidate.dto';

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
  @Get('routine-candidates')
  getRoutineCandidates(@Req() request: AuthenticatedRequest) {
    return this.coachService.getRoutineCandidates(request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('routine-candidates/select')
  selectRoutineCandidate(
    @Req() request: AuthenticatedRequest,
    @Body() selectRoutineCandidateDto: SelectRoutineCandidateDto,
  ) {
    return this.coachService.selectRoutineCandidate(
      request.user.id,
      selectRoutineCandidateDto.candidateKey,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('assignments/today')
  getTodayAssignment(@Req() request: AuthenticatedRequest) {
    return this.coachService.getTodayAssignment(request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('assignments/:id')
  getAssignment(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.coachService.getAssignment(request.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('assignments/today')
  createTodayAssignment(@Req() request: AuthenticatedRequest) {
    return this.coachService.createTodayAssignment(request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('assignments/:id/complete')
  completeAssignment(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() completeAssignmentDto: CompleteAssignmentDto,
  ) {
    return this.coachService.completeAssignment(
      request.user.id,
      id,
      completeAssignmentDto,
    );
  }
}
