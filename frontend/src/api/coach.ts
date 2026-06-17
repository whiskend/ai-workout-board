import { apiRequest, getStoredToken } from './client';
import type { CoachDashboard, WorkoutAssignment } from '../types/coach';

export function getCoachDashboard() {
  return apiRequest<CoachDashboard>('/coach/dashboard', {
    token: getStoredToken(),
  });
}

export function getTodayAssignment() {
  return apiRequest<WorkoutAssignment | null>('/coach/assignments/today', {
    token: getStoredToken(),
  });
}
