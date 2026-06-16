import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router';
import { getPosts } from '../api/posts';
import type { Post } from '../types/post';

export default function PostListPage() {
  const pageSize = 10;
  const [posts, setPosts] = useState<Post[]>([]);
  const [keyword, setKeyword] = useState('');
  const [submittedKeyword, setSubmittedKeyword] = useState('');
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPosts() {
      setIsLoading(true);
      setError('');

      try {
        const data = await getPosts({
          keyword: submittedKeyword,
          limit: pageSize,
          offset,
        });
        setPosts(data.items);
        setTotalCount(data.totalCount);
        setHasNext(data.hasNext);
        setHasPrevious(data.hasPrevious);
      } catch (error) {
        setError(error instanceof Error ? error.message : '게시글 목록 조회에 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, [offset, submittedKeyword]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedKeyword(keyword);
    setOffset(0);
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

      <p>
        전체 {totalCount}개 중 {offset + 1}
        {posts.length > 0 && `-${offset + posts.length}`}번째 기록
      </p>

      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
            <div>{post.bodyPart}</div>
            <div>{post.author.nickname}</div>
            <div>{new Date(post.date).toLocaleDateString()}</div>
            {post.postTags.length > 0 && (
              <div>
                {post.postTags.map((postTag) => (
                  <span key={postTag.tagId}>#{postTag.tag.name} </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>

      <div>
        <button
          type="button"
          disabled={!hasPrevious}
          onClick={() => setOffset(Math.max(offset - pageSize, 0))}
        >
          이전
        </button>
        <span>{Math.floor(offset / pageSize) + 1}페이지</span>
        <button
          type="button"
          disabled={!hasNext}
          onClick={() => setOffset(offset + pageSize)}
        >
          다음
        </button>
      </div>
    </main>
  );
}
