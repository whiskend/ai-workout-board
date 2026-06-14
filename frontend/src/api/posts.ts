import { apiRequest, getStoredToken } from './client';
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