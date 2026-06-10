import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkoutPostDto } from './create-workout-post.dto';

export class UpdateWorkoutPostDto extends PartialType(CreateWorkoutPostDto) {}
