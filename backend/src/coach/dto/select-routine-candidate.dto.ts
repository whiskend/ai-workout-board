import { IsIn } from 'class-validator';
import { ROUTINE_CANDIDATE_KEYS } from '../routine-types';

export class SelectRoutineCandidateDto {
  @IsIn(ROUTINE_CANDIDATE_KEYS)
  candidateKey: string;
}
