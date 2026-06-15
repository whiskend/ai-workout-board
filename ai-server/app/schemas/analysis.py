from typing import Optional
from pydantic import BaseModel, Field


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
    previousPosts: list[PostRecord] = Field(default_factory=list)


class ReferencedPostRecord(BaseModel):
    id: int
    title: str
    date: str
    matchedExercises: list[str]


class AnalysisResponse(BaseModel):
    summary: str
    recommendation: str
    nextGoal: str
    referencedPostCount: int
    referencedPosts: list[ReferencedPostRecord] = Field(default_factory=list)
    basis: list[str] = Field(default_factory=list)
    analysisMode: str = "rule-based"
