import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router';
import { getPosts } from '../api/posts';
import type { Post } from '../types/post';

export default function PostListPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : '게시글 목록 조회에 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, []);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await getPosts(keyword);
      setPosts(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : '게시글 검색에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <main>게시글을 불러오는 중입니다.</main>;
  }

  return (
    <main>
      <h1>운동 기록 게시판</h1>
      <Link to="/posts/new">운동 기록 작성</Link>

      <form onSubmit={handleSearch}>
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="제목 또는 운동명 검색"
        />
        <button type="submit">검색</button>
      </form>

      {error && <p>{error}</p>}

      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
            <div>{post.bodyPart}</div>
            <div>{post.author.nickname}</div>
            <div>{new Date(post.date).toLocaleDateString()}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
