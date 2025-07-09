import {Article} from '@/types/Article';
import {api} from './apiClient';
import {ROWS_PER_PAGE} from '@/screens/Bookmark';
import {QueryFunctionContext} from '@tanstack/react-query';

export const like = async (articleId: string) => {
  const data = await api.post(`/v1/articles/${articleId}/likes`, {});

  return data;
};

export const unlike = async (articleId: string) => {
  const data = await api.delete(`/v1/articles/${articleId}/likes`);

  return data;
};

export const share = async (articleId: string) => {
  const data = await api.post(`/v1/articles/${articleId}/shares`, {});

  return data;
};

export const unInterest = async (articleId: string) => {
  const data = await api.post(`/v1/articles/${articleId}/uninterests`, {});

  return data;
};

export const addBookmark = async (articleId: string) => {
  const data = await api.post(`/v1/articles/${articleId}/bookmarks`, {});

  return data;
};

export const deleteBookmark = async (articleId: string) => {
  const data = await api.delete(`/v1/articles/${articleId}/bookmarks`);

  return data;
};

export const getBookmarkedArticles = async (
  context: QueryFunctionContext<
    readonly ['bookmarks'], // queryKey literal 타입
    string | null // pageParam 타입
  >,
) => {
  const {pageParam} = context; // string | null

  let url = `/v1/articles/bookmarks?limit=${ROWS_PER_PAGE}`;
  if (pageParam) {
    url += `&from=${pageParam}`;
  }

  const {data} = await api.get<{articles: Article[]; next: string | null}>(url);

  return data;
};

export const getHistory = async (
  context: QueryFunctionContext<
    readonly ['history'], // queryKey literal 타입
    string | null // pageParam 타입
  >,
) => {
  const {pageParam} = context; // string | null

  let url = `/v1/articles/history?limit=${ROWS_PER_PAGE}`;
  if (pageParam) {
    url += `&from=${pageParam}`;
  }

  const {data} = await api.get<{articles: Article[]; next: string | null}>(url);

  return data;
};
