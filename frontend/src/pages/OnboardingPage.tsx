import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { Check, Clock, Dumbbell, Goal, Layers3 } from 'lucide-react';
import { getStoredToken } from '@/api/client';
import { getMyOnboardingProfile, saveOnboardingProfile } from '@/api/onboarding';
import { PageHeader } from '@/components/PageHeader';
import { SelectField } from '@/components/SelectField';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  equipmentOptions,
  experienceOptions,
  goalOptions,
  minuteOptions,
  splitOptions,
} from '@/lib/coachOptions';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const token = getStoredToken();
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [trainingGoal, setTrainingGoal] = useState('hypertrophy');
  const [availableMinutes, setAvailableMinutes] = useState(60);
  const [splitType, setSplitType] = useState('three_split');
  const [experienceLevel, setExperienceLevel] = useState('beginner');
  const [isLoading, setIsLoading] = useState(Boolean(token));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProfile() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await getMyOnboardingProfile();

        if (profile) {
          setSelectedEquipment(profile.availableEquipment);
          setTrainingGoal(profile.trainingGoal);
          setAvailableMinutes(profile.availableMinutes);
          setSplitType(profile.splitType);
          setExperienceLevel(profile.experienceLevel);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : '기존 코치 설정을 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [token]);

  function toggleEquipment(equipment: string) {
    setSelectedEquipment((current) =>
      current.includes(equipment)
        ? current.filter((item) => item !== equipment)
        : [...current, equipment],
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (selectedEquipment.length === 0) {
      setError('사용 가능한 기구를 하나 이상 선택해주세요.');
      return;
    }

    try {
      setIsSaving(true);
      setError('');
      await saveOnboardingProfile({
        availableEquipment: selectedEquipment,
        trainingGoal,
        availableMinutes,
        splitType,
        experienceLevel,
      });
      navigate('/coach');
    } catch (error) {
      setError(error instanceof Error ? error.message : '코치 설정 저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  }

  if (!token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>로그인이 필요합니다</CardTitle>
          <CardDescription>코치 설정은 사용자별 운동 환경으로 저장됩니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link to="/login">로그인하러 가기</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">코치 설정을 불러오는 중입니다.</div>;
  }

  return (
    <div>
      <PageHeader
        title="코치 설정"
        description="AI 운동 코치가 오늘의 과제를 만들 때 사용할 기본 정보를 정합니다."
        actions={
          <Button asChild variant="outline">
            <Link to="/coach">코치 화면</Link>
          </Button>
        }
      />

      <form className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]" onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary" />
              사용 가능한 기구
            </CardTitle>
            <CardDescription>실제로 헬스장에서 사용할 수 있는 기구만 선택하세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {equipmentOptions.map((equipment) => {
                const isSelected = selectedEquipment.includes(equipment);

                return (
                  <button
                    key={equipment}
                    type="button"
                    className={
                      isSelected
                        ? 'flex min-h-12 items-center justify-center gap-2 rounded-md border border-primary bg-primary text-sm font-medium text-primary-foreground'
                        : 'flex min-h-12 items-center justify-center gap-2 rounded-md border border-border bg-background text-sm font-medium text-foreground hover:bg-accent'
                    }
                    onClick={() => toggleEquipment(equipment)}
                  >
                    {isSelected && <Check className="h-4 w-4" />}
                    {equipment}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>요약</CardTitle>
            <CardDescription>선택한 정보는 RoutineCycle 뼈대 생성에 사용됩니다.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {selectedEquipment.length === 0 ? (
              <span className="text-sm text-muted-foreground">선택된 기구가 없습니다.</span>
            ) : (
              selectedEquipment.map((equipment) => (
                <Badge key={equipment} variant="secondary">
                  {equipment}
                </Badge>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>운동 조건</CardTitle>
            <CardDescription>
              이번 단계에서는 의료 정보가 아니라 과제 생성을 위한 운동 조건만 받습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <SelectField
              id="trainingGoal"
              label="운동 목적"
              value={trainingGoal}
              options={goalOptions}
              icon={Goal}
              onChange={setTrainingGoal}
            />

            <div className="space-y-2">
              <Label className="flex items-center gap-2" htmlFor="availableMinutes">
                <Clock className="h-4 w-4 text-primary" />
                하루 운동 가능 시간
              </Label>
              <select
                id="availableMinutes"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                value={availableMinutes}
                onChange={(event) => setAvailableMinutes(Number(event.target.value))}
              >
                {minuteOptions.map((minutes) => (
                  <option key={minutes} value={minutes}>
                    {minutes}분
                  </option>
                ))}
              </select>
            </div>

            <SelectField
              id="splitType"
              label="분할 방식"
              value={splitType}
              options={splitOptions}
              icon={Layers3}
              onChange={setSplitType}
            />

            <SelectField
              id="experienceLevel"
              label="운동 경력"
              value={experienceLevel}
              options={experienceOptions}
              icon={Dumbbell}
              onChange={setExperienceLevel}
            />
          </CardContent>
        </Card>

        {error && (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive lg:col-span-2">
            {error}
          </p>
        )}

        <div className="flex justify-end lg:col-span-2">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? '저장 중' : '코치 설정 저장'}
          </Button>
        </div>
      </form>
    </div>
  );
}
