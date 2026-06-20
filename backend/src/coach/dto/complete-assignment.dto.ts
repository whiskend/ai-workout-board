import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class CompleteAssignmentSetDto {
  @IsInt()
  @Min(1)
  assignmentSetId: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  weightKg?: number | null;

  @IsInt()
  @Min(0)
  reps: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  perceivedDifficulty?: number | null;
}

export class CompleteAssignmentExerciseDto {
  @IsInt()
  @Min(1)
  assignmentExerciseId: number;

  @IsOptional()
  @IsString()
  memo?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CompleteAssignmentSetDto)
  sets: CompleteAssignmentSetDto[];
}

export class CompleteAssignmentDto {
  @IsOptional()
  @IsString()
  memo?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CompleteAssignmentExerciseDto)
  exercises: CompleteAssignmentExerciseDto[];
}
