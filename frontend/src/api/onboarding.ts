import { apiRequest, getStoredToken } from './client';
import type {
  CreateOnboardingProfileRequest,
  OnboardingProfile,
  UpsertOnboardingProfileResponse,
} from '../types/coach';

export function getMyOnboardingProfile() {
  return apiRequest<OnboardingProfile | null>('/onboarding/me', {
    token: getStoredToken(),
  });
}

export function saveOnboardingProfile(data: CreateOnboardingProfileRequest) {
  return apiRequest<UpsertOnboardingProfileResponse>('/onboarding', {
    method: 'POST',
    body: data,
    token: getStoredToken(),
  });
}
