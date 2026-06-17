import type { LucideIcon } from 'lucide-react';

export const equipmentOptions = [
  '바벨',
  '덤벨',
  '벤치',
  '랫풀다운',
  '케이블',
  '레그프레스',
  '스쿼트랙',
  '풀업바',
];

export const goalOptions = [
  { value: 'strength', label: '스트렝스' },
  { value: 'hypertrophy', label: '근비대' },
  { value: 'endurance', label: '근지구력' },
];

export const splitOptions = [
  { value: 'full_body', label: '무분할' },
  { value: 'two_split', label: '2분할' },
  { value: 'three_split', label: '3분할' },
  { value: 'four_split', label: '4분할' },
];

export const experienceOptions = [
  { value: 'beginner', label: '초보자' },
  { value: 'intermediate', label: '중급자' },
  { value: 'advanced', label: '숙련자' },
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
};

export type SelectIcon = LucideIcon;

export function formatCoachLabel(labels: Record<string, string>, value: string) {
  return labels[value] ?? value;
}
