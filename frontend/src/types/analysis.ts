export type AnalysisResult = {
  summary: string;
  recommendation: string;
  nextGoal: string;
  referencedPostCount: number;
  referencedPosts: {
    id: number;
    title: string;
    date: string;
    matchedExercises: string[];
  }[];
  basis: string[];
  analysisMode: string;
};
