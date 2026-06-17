import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateOnboardingProfileDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @IsString({ each: true })
  availableEquipment: string[];

  @IsString()
  @IsNotEmpty()
  trainingGoal: string;

  @IsInt()
  @Min(15)
  @Max(180)
  availableMinutes: number;

  @IsString()
  @IsNotEmpty()
  splitType: string;

  @IsString()
  @IsNotEmpty()
  experienceLevel: string;
}

