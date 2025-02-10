import {FeedResponse} from '../types/api/FeedResult';
import {api} from './apiClient';

export const getFeed = async () => {
  const data = await api.get<FeedResponse>('/v1/feed');

  return data;
};
