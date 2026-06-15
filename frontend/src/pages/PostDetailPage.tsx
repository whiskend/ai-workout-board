import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { analyzePost, getPost } from '../api/posts';
import type { AnalysisResult } from '../types/analysis';
import type { Post } from '../types/post';

export default function PostDetailPage() {
  const params = useParams();
  const postId = Number(params.id);
  const [post, setPost] = useState<Post | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [analysisError, setAnalysisError] = useState('');

  useEffect(() => {
    async function loadPost() {
      try {
        const data = await getPost(postId);
        setPost(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : '게시글 조회에 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    loadPost();
  }, [postId]);

  async function handleAnalyze() {
    setIsAnalyzing(true);
    setAnalysisError('');

    try {
      const result = await analyzePost(postId);
      setAnalysis(result);
    } catch (error) {
      setAnalysisError(
        error instanceof Error ? error.message : 'AI 분석에 실패했습니다.',
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  if (isLoading) {
    return <main>게시글을 불러오는 중입니다.</main>;
  }

  if (!post) {
    return <main>{error || '게시글을 찾을 수 없습니다.'}</main>;
  }

  return (
    <main>
      <Link to="/posts">목록으로</Link>
      <h1>{post.title}</h1>
      <p>작성자: {post.author.nickname}</p>
      <p>운동 날짜: {new Date(post.date).toLocaleDateString()}</p>
      <p>운동 부위: {post.bodyPart}</p>
      {post.memo && <p>메모: {post.memo}</p>}

      <section>
        <h2>운동 기록</h2>
        {post.exercises.map((exercise) => (
          <article key={exercise.id}>
            <h3>{exercise.exerciseName}</h3>
            <p>무게: {exercise.weightKg}kg</p>
            {exercise.targetReps && <p>목표 반복 수: {exercise.targetReps}</p>}

            <ul>
              {exercise.sets.map((set) => (
                <li key={set.id}>
                  {set.setNumber}세트: {set.reps}회
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section>
        <h2>AI 분석</h2>
        <button type="button" onClick={handleAnalyze} disabled={isAnalyzing}>
          {isAnalyzing ? '분석 중...' : 'AI 분석'}
        </button>

        {analysisError && <p>{analysisError}</p>}

        {analysis && (
          <article>
            <h3>요약</h3>
            <p>{analysis.summary}</p>

            <h3>추천</h3>
            <p>{analysis.recommendation}</p>

            <h3>다음 목표</h3>
            <p>{analysis.nextGoal}</p>

            <h3>분석 근거</h3>
            <ul>
              {analysis.basis.map((basis) => (
                <li key={basis}>{basis}</li>
              ))}
            </ul>

            {analysis.referencedPosts.length > 0 && (
              <>
                <h3>참고한 이전 기록</h3>
                <ul>
                  {analysis.referencedPosts.map((referencedPost) => (
                    <li key={referencedPost.id}>
                      {referencedPost.date} - {referencedPost.title}
                      {referencedPost.matchedExercises.length > 0 &&
                        ` (${referencedPost.matchedExercises.join(', ')})`}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <p>참고한 이전 기록 수: {analysis.referencedPostCount}</p>
            <p>분석 모드: {analysis.analysisMode}</p>
          </article>
        )}
      </section>
    </main>
  );
}
