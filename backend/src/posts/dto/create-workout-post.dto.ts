import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateWorkoutExerciseDto } from './create-workout-exercise.dto';

export class CreateWorkoutPostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  workoutDate: string;

  @IsString()
  @IsNotEmpty()
  bodyPart: string;

  @IsOptional()
  @IsString()
  memo?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateWorkoutExerciseDto)
  exercises: CreateWorkoutExerciseDto[];
}
