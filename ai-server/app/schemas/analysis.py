from typing import Optional
from pydantic import BaseModel


class SetRecord(BaseModel):
    setNumber: int
    reps: int
    perceivedDifficulty: Optional[int] = None


class ExerciseRecord(BaseModel):
    exerciseName: str
    weightKg: float
    targetReps: Optional[int] = None
    sets: list[SetRecord]


class PostRecord(BaseModel):
    id: int
    title: str
    date: str
    bodyPart: str
    memo: Optional[str] = None
    exercises: list[ExerciseRecord]


class AnalysisRequest(BaseModel):
    currentPost: PostRecord
    previousPosts: list[PostRecord] = []


class AnalysisResponse(BaseModel):
    summary: str
    recommendation: str
    nextGoal: str
    referencedPostCount: int