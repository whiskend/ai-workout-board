import { apiRequest, getStoredToken } from './client';
import type { AnalysisResult } from '../types/analysis';
import type { CreatePostRequest, Post } from '../types/post';

export function getPosts(keyword?: string) {
  const trimmedKeyword = keyword?.trim();
  const path = trimmedKeyword
    ? `/posts?keyword=${encodeURIComponent(trimmedKeyword)}`
    : '/posts';

  return apiRequest<Post[]>(path);
}

export function getPost(id: number) {
  return apiRequest<Post>(`/posts/${id}`);
}

export function createPost(data: CreatePostRequest) {
  return apiRequest<Post>('/posts', {
    method: 'POST',
    body: data,
    token: getStoredToken(),
  });
}

export function analyzePost(id: number) {
  return apiRequest<AnalysisResult>(`/posts/${id}/analyze`, {
    method: 'POST',
    token: getStoredToken(),
  });
}
