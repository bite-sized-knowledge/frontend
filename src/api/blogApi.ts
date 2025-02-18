import {BlogArticleResponse, BlogResponse} from '@/types/api/Blog';
import {api} from './apiClient';

export const getBlog = async (blogId: string) => {
  const data = await api.get<BlogResponse>(`/v1/blogs/${blogId}`);

  return data;
};

/**
 * 블로그 아티클 조회
 * @param blogId 블로그 ID
 * @param limit 조회 개수
 * @param from 조회 시작 게시글 ID
 * @returns
 */
export const getBlogArticle = async (
  blogId: string,
  limit: number,
  from: string | null,
) => {
  if (!blogId) {
    return;
  }

  let url = `/v1/blogs/${blogId}/articles?limit=${limit}`;

  if (from) {
    url += `&from=${from}`;
  }

  const data = await api.get<BlogArticleResponse>(url);

  return data;
};
