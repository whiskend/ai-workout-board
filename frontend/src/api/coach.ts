import { apiRequest, getStoredToken } from './client';
import type {
  CoachDashboard,
  CompleteAssignmentRequest,
  RoutineCandidatesResponse,
  RoutineCycle,
  WorkoutAssignment,
  WorkoutLog,
} from '../types/coach';

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

export function getAssignment(assignmentId: number) {
  return apiRequest<WorkoutAssignment>(`/coach/assignments/${assignmentId}`, {
    token: getStoredToken(),
  });
}

export function getRoutineCandidates() {
  return apiRequest<RoutineCandidatesResponse>('/coach/routine-candidates', {
    token: getStoredToken(),
  });
}

export function selectRoutineCandidate(candidateKey: string) {
  return apiRequest<RoutineCycle>('/coach/routine-candidates/select', {
    method: 'POST',
    body: { candidateKey },
    token: getStoredToken(),
  });
}

export function createTodayAssignment() {
  return apiRequest<WorkoutAssignment>('/coach/assignments/today', {
    method: 'POST',
    token: getStoredToken(),
  });
}

export function completeAssignment(
  assignmentId: number,
  request: CompleteAssignmentRequest,
) {
  return apiRequest<WorkoutLog>(`/coach/assignments/${assignmentId}/complete`, {
    method: 'POST',
    body: request,
    token: getStoredToken(),
  });
}
