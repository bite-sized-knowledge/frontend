import {api} from './apiClient';

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
