import type { LucideIcon } from 'lucide-react';

export const equipmentOptions = [
  '스미스머신',
  '덤벨',
  '케이블머신',
  '평행봉',
  '철봉',
  '렛풀다운',
];

export const goalOptions = [
  {
    value: 'strength',
    label: '스트렝스',
    description: '힘 키우기. 무게를 조금씩 올리는 데 집중합니다. 적은 반복 수로 무겁게 운동하는 방향입니다.',
  },
  {
    value: 'hypertrophy',
    label: '근비대',
    description: '근육 키우기. 근육에 충분한 자극을 주는 데 집중합니다. 초보자가 가장 무난하게 고르기 좋습니다.',
  },
  {
    value: 'endurance',
    label: '근지구력',
    description: '오래 버티기. 가벼운 무게로 반복 수를 늘리는 데 집중합니다. 체력과 운동 지속력을 키우는 방향입니다.',
  },
];

export const splitOptions = [
  { value: 'full_body', label: '무분할' },
  { value: 'two_split', label: '2분할' },
  { value: 'three_split', label: '3분할' },
  { value: 'four_split', label: '4분할' },
];

export const experienceOptions = [
  {
    value: 'beginner',
    label: '초보자',
    description: '운동이 아직 익숙하지 않은 단계입니다. 기구 사용법과 자세가 어색해서 철봉 풀업이나 평행봉 딥스는 바로 넣지 않습니다.',
  },
  {
    value: 'intermediate',
    label: '중급자',
    description: '기본 운동은 혼자 할 수 있는 단계입니다. 덤벨, 스미스머신, 케이블 운동은 익숙하지만 풀업이나 딥스는 보조가 필요할 수 있습니다.',
  },
  {
    value: 'advanced',
    label: '숙련자',
    description: '풀업이나 딥스도 할 수 있는 단계입니다. 자세를 스스로 조절할 수 있고, 철봉/평행봉 운동도 과제에 포함할 수 있습니다.',
  },
];

export const minuteOptions = [30, 45, 60, 90];

export const goalLabels = Object.fromEntries(
  goalOptions.map((option) => [option.value, option.label]),
);

export const splitLabels = Object.fromEntries(
  splitOptions.map((option) => [option.value, option.label]),
);

export type SelectOption = {
  value: string;
  label: string;
  description?: string;
};

export type SelectIcon = LucideIcon;

export function formatCoachLabel(labels: Record<string, string>, value: string) {
  return labels[value] ?? value;
}
