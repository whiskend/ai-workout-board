import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { getPost } from '../api/posts';
import type { Post } from '../types/post';

export default function PostDetailPage() {
  const params = useParams();
  const postId = Number(params.id);
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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
    </main>
  );
}