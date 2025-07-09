import {getHistory} from '@/api/articleApi';
import {useInfiniteQuery} from '@tanstack/react-query';

export const useHistory = () => {
  return useInfiniteQuery({
    queryKey: ['history'] as const,
    queryFn: getHistory,
    getNextPageParam: lastPage => lastPage?.next ?? undefined,
    initialPageParam: null,
    staleTime: 1000 * 60 * 5, // 5분
    placeholderData: previousData => previousData,
    gcTime: 1000 * 60 * 30, // 이전 cacheTime
  });
};
