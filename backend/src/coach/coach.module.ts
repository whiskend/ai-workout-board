import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CoachAssignmentService } from './coach-assignment.service';
import { CoachController } from './coach.controller';
import { CoachService } from './coach.service';
import { RoutineSelectionService } from './routine-selection.service';
import { WorkoutLogService } from './workout-log.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [CoachController],
  providers: [
    CoachService,
    CoachAssignmentService,
    RoutineSelectionService,
    WorkoutLogService,
  ],
})
export class CoachModule {}
