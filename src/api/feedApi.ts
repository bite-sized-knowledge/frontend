import {Article} from '@/types/Article';
import {api} from './apiClient';

export const getRecommendedFeed = async () => {
  const data = await api.get<Article[]>('/v1/feed');

  return data;
};

interface GetRecentFeedResponse {
  articles: Article[];
  next: string | null;
}

export const getRecentFeed = async (from: string | null) => {
  const res = await api.get<GetRecentFeedResponse>(
    `/v1/articles/recent${from ? `?from=${from}` : ''}`,
  );

  return res.data;
};
