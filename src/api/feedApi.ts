import {Article} from '@/types/Article';
import {api} from './apiClient';

export const getFeed = async () => {
  const data = await api.get<Article[]>('/v1/feed');

  return data;
};
