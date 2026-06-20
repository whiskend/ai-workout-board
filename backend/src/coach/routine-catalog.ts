import type { ExperienceLevel, RoutineCandidateKey } from './routine-types';

export type ExerciseTemplate = {
  readonly exerciseName: string;
  readonly normalizedName: string;
  readonly equipmentName: string;
  readonly equipmentType: string;
  readonly dayTags: readonly string[];
  readonly minExperience: ExperienceLevel;
  readonly candidateFit: readonly RoutineCandidateKey[];
  readonly baseWeightKgByExperience: Record<ExperienceLevel, number | null>;
  readonly coachNote: string;
};

export const EXPERIENCE_ORDER: Record<ExperienceLevel, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

export const CANDIDATE_META: Record<
  RoutineCandidateKey,
  {
    readonly name: string;
    readonly summary: string;
    readonly description: string;
  }
> = {
  stable: {
    name: '안정형',
    summary: '자세와 기록 습관을 먼저 잡는 루틴',
    description: '스미스머신, 케이블, 렛풀다운처럼 움직임이 안정적인 운동을 우선 배치합니다.',
  },
  growth: {
    name: '성장형',
    summary: '기록 향상과 운동 다양성의 균형 루틴',
    description: '스미스머신과 덤벨을 섞어 주요 운동 기록을 만들고 보조 운동으로 볼륨을 채웁니다.',
  },
  challenge: {
    name: '도전형',
    summary: '가능한 범위 안에서 자유도 높은 운동을 섞는 루틴',
    description: '덤벨과 숙련자용 체중 운동을 더 적극적으로 넣어 운동 난도를 조금 높입니다.',
  },
};

export const EXERCISE_TEMPLATES: readonly ExerciseTemplate[] = [
  {
    exerciseName: '스미스머신 벤치프레스',
    normalizedName: '스미스머신 벤치프레스',
    equipmentName: '스미스머신',
    equipmentType: 'smith',
    dayTags: ['전신', '상체', '밀기', '가슴/삼두'],
    minExperience: 'beginner',
    candidateFit: ['stable', 'growth', 'challenge'],
    baseWeightKgByExperience: { beginner: 20, intermediate: 35, advanced: 50 },
    coachNote: '궤적이 고정되어 있어 초반 기록을 안정적으로 쌓기 좋습니다.',
  },
  {
    exerciseName: '덤벨 벤치프레스',
    normalizedName: '덤벨 벤치프레스',
    equipmentName: '덤벨',
    equipmentType: 'dumbbell',
    dayTags: ['전신', '상체', '밀기', '가슴/삼두'],
    minExperience: 'beginner',
    candidateFit: ['growth', 'challenge'],
    baseWeightKgByExperience: { beginner: 8, intermediate: 14, advanced: 22 },
    coachNote: '좌우 균형을 같이 연습할 수 있는 가슴 운동입니다.',
  },
  {
    exerciseName: '케이블 푸시다운',
    normalizedName: '케이블 푸시다운',
    equipmentName: '케이블머신',
    equipmentType: 'cable',
    dayTags: ['상체', '밀기', '가슴/삼두'],
    minExperience: 'beginner',
    candidateFit: ['stable', 'growth'],
    baseWeightKgByExperience: { beginner: 10, intermediate: 20, advanced: 30 },
    coachNote: '삼두 자극을 안전하게 가져가기 좋은 보조 운동입니다.',
  },
  {
    exerciseName: '렛풀다운',
    normalizedName: '렛풀다운',
    equipmentName: '렛풀다운',
    equipmentType: 'lat_pulldown',
    dayTags: ['전신', '상체', '당기기', '등/이두'],
    minExperience: 'beginner',
    candidateFit: ['stable', 'growth', 'challenge'],
    baseWeightKgByExperience: { beginner: 25, intermediate: 40, advanced: 55 },
    coachNote: '풀업 전 단계로 등 운동 기록을 쌓기 좋습니다.',
  },
  {
    exerciseName: '덤벨 로우',
    normalizedName: '덤벨 로우',
    equipmentName: '덤벨',
    equipmentType: 'dumbbell',
    dayTags: ['전신', '상체', '당기기', '등/이두'],
    minExperience: 'beginner',
    candidateFit: ['growth', 'challenge'],
    baseWeightKgByExperience: { beginner: 8, intermediate: 16, advanced: 24 },
    coachNote: '등을 당기는 감각과 좌우 균형을 같이 확인합니다.',
  },
  {
    exerciseName: '케이블 로우',
    normalizedName: '케이블 로우',
    equipmentName: '케이블머신',
    equipmentType: 'cable',
    dayTags: ['전신', '상체', '당기기', '등/이두'],
    minExperience: 'beginner',
    candidateFit: ['stable', 'growth'],
    baseWeightKgByExperience: { beginner: 15, intermediate: 30, advanced: 45 },
    coachNote: '자세가 흔들릴 때도 등 수축을 연습하기 좋습니다.',
  },
  {
    exerciseName: '스미스머신 스쿼트',
    normalizedName: '스미스머신 스쿼트',
    equipmentName: '스미스머신',
    equipmentType: 'smith',
    dayTags: ['전신', '하체'],
    minExperience: 'beginner',
    candidateFit: ['stable', 'growth', 'challenge'],
    baseWeightKgByExperience: { beginner: 20, intermediate: 40, advanced: 60 },
    coachNote: '하체 루틴의 기준 기록으로 쓰기 좋습니다.',
  },
  {
    exerciseName: '덤벨 런지',
    normalizedName: '덤벨 런지',
    equipmentName: '덤벨',
    equipmentType: 'dumbbell',
    dayTags: ['전신', '하체'],
    minExperience: 'beginner',
    candidateFit: ['growth', 'challenge'],
    baseWeightKgByExperience: { beginner: 6, intermediate: 12, advanced: 20 },
    coachNote: '한쪽씩 수행해서 균형과 하체 볼륨을 함께 챙깁니다.',
  },
  {
    exerciseName: '케이블 풀스루',
    normalizedName: '케이블 풀스루',
    equipmentName: '케이블머신',
    equipmentType: 'cable',
    dayTags: ['전신', '하체'],
    minExperience: 'beginner',
    candidateFit: ['stable', 'growth'],
    baseWeightKgByExperience: { beginner: 15, intermediate: 25, advanced: 35 },
    coachNote: '허벅지 뒤쪽과 둔근을 무리 없이 연습합니다.',
  },
  {
    exerciseName: '덤벨 숄더프레스',
    normalizedName: '덤벨 숄더프레스',
    equipmentName: '덤벨',
    equipmentType: 'dumbbell',
    dayTags: ['상체', '밀기', '어깨'],
    minExperience: 'beginner',
    candidateFit: ['growth', 'challenge'],
    baseWeightKgByExperience: { beginner: 5, intermediate: 10, advanced: 16 },
    coachNote: '어깨 힘과 안정성을 같이 확인합니다.',
  },
  {
    exerciseName: '케이블 레터럴 레이즈',
    normalizedName: '케이블 레터럴 레이즈',
    equipmentName: '케이블머신',
    equipmentType: 'cable',
    dayTags: ['상체', '밀기', '어깨'],
    minExperience: 'beginner',
    candidateFit: ['stable', 'growth'],
    baseWeightKgByExperience: { beginner: 3, intermediate: 6, advanced: 10 },
    coachNote: '가벼운 무게로 어깨 측면 자극을 안정적으로 잡습니다.',
  },
  {
    exerciseName: '풀업',
    normalizedName: '풀업',
    equipmentName: '철봉',
    equipmentType: 'bodyweight',
    dayTags: ['상체', '당기기', '등/이두'],
    minExperience: 'advanced',
    candidateFit: ['challenge'],
    baseWeightKgByExperience: { beginner: null, intermediate: null, advanced: null },
    coachNote: '숙련자용 체중 운동입니다. 반복 수 중심으로 기록합니다.',
  },
  {
    exerciseName: '딥스',
    normalizedName: '딥스',
    equipmentName: '평행봉',
    equipmentType: 'bodyweight',
    dayTags: ['상체', '밀기', '가슴/삼두'],
    minExperience: 'advanced',
    candidateFit: ['challenge'],
    baseWeightKgByExperience: { beginner: null, intermediate: null, advanced: null },
    coachNote: '숙련자용 체중 운동입니다. 어깨에 부담이 없을 때만 수행합니다.',
  },
];
