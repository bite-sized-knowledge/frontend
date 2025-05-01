import {getBookmarkedArticles} from '@/api/articleApi';
import {useInfiniteQuery} from '@tanstack/react-query';

export const useBookmarkedArticles = () => {
  return useInfiniteQuery({
    queryKey: ['bookmarks'] as const,
    queryFn: getBookmarkedArticles,
    getNextPageParam: lastPage => lastPage?.next ?? undefined,
    initialPageParam: null,
    staleTime: 1000 * 60 * 5, // 5분
    placeholderData: previousData => previousData,
    gcTime: 1000 * 60 * 30, // 이전 cacheTime
  });
};
