import type { User } from './auth';

export type ExerciseSet = {
  id: number;
  setNumber: number;
  reps: number;
  perceivedDifficulty?: number;
};

export type Exercise = {
  id: number;
  exerciseName: string;
  normalizedName?: string;
  weightKg: number;
  targetReps?: number;
  orderIndex: number;
  memo?: string;
  sets: ExerciseSet[];
};

export type Post = {
  id: number;
  authorId: number;
  title: string;
  date: string;
  bodyPart: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
  author: User;
  exercises: Exercise[];
};

export type CreatePostRequest = {
  title: string;
  date: string;
  bodyPart: string;
  memo?: string;
  exercises: {
    exerciseName: string;
    weightKg: number;
    targetReps?: number;
    sets: {
      setNumber: number;
      reps: number;
      perceivedDifficulty?: number;
    }[];
  }[];
};