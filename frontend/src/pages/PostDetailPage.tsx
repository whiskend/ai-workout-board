import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useParams } from 'react-router';
import { analyzePost, createComment, deleteComment, getPost } from '../api/posts';
import type { AnalysisResult } from '../types/analysis';
import type { Post } from '../types/post';

export default function PostDetailPage() {
  const params = useParams();
  const postId = Number(params.id);
  const [post, setPost] = useState<Post | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [error, setError] = useState('');
  const [analysisError, setAnalysisError] = useState('');
  const [commentError, setCommentError] = useState('');

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

  async function handleCreateComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCommentError('');

    try {
      const comment = await createComment(postId, {
        content: commentContent,
      });

      setPost((currentPost) =>
        currentPost
          ? {
              ...currentPost,
              comments: [...currentPost.comments, comment],
            }
          : currentPost,
      );
      setCommentContent('');
    } catch (error) {
      setCommentError(
        error instanceof Error ? error.message : '댓글 작성에 실패했습니다.',
      );
    }
  }

  async function handleDeleteComment(commentId: number) {
    setCommentError('');

    try {
      await deleteComment(postId, commentId);
      setPost((currentPost) =>
        currentPost
          ? {
              ...currentPost,
              comments: currentPost.comments.filter(
                (comment) => comment.id !== commentId,
              ),
            }
          : currentPost,
      );
    } catch (error) {
      setCommentError(
        error instanceof Error ? error.message : '댓글 삭제에 실패했습니다.',
      );
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
      {post.postTags.length > 0 && (
        <p>
          태그:{' '}
          {post.postTags.map((postTag) => (
            <span key={postTag.tagId}>#{postTag.tag.name} </span>
          ))}
        </p>
      )}

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
        <h2>댓글</h2>

        <form onSubmit={handleCreateComment}>
          <textarea
            value={commentContent}
            onChange={(event) => setCommentContent(event.target.value)}
            placeholder="응원이나 피드백을 남겨보세요."
          />
          <button type="submit">댓글 작성</button>
        </form>

        {commentError && <p>{commentError}</p>}

        {post.comments.length === 0 ? (
          <p>아직 댓글이 없습니다.</p>
        ) : (
          <ul>
            {post.comments.map((comment) => (
              <li key={comment.id}>
                <p>{comment.content}</p>
                <div>
                  {comment.author.nickname} ·{' '}
                  {new Date(comment.createdAt).toLocaleString()}
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
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

            {analysis.workflowSteps.length > 0 && (
              <>
                <h3>분석 흐름</h3>
                <ol>
                  {analysis.workflowSteps.map((step) => (
                    <li key={step.step}>
                      {step.name} - {step.status}: {step.detail}
                    </li>
                  ))}
                </ol>
              </>
            )}

            {analysis.toolCalls.length > 0 && (
              <>
                <h3>도구 호출</h3>
                <ul>
                  {analysis.toolCalls.map((toolCall) => (
                    <li key={`${toolCall.toolName}-${toolCall.input}`}>
                      {toolCall.toolName}: {toolCall.input} → {toolCall.output} (
                      {toolCall.source})
                    </li>
                  ))}
                </ul>
              </>
            )}

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
