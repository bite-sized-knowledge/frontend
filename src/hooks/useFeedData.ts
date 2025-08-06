import {useState, useEffect} from 'react';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {getRecentFeed, getRecommendedFeed} from '@/api/feedApi';
import {Article} from '@/types/Article';
import {mergeWithoutDuplicates} from '@/util/utils';

type TabType = 'latest' | 'recommend';

export const useFeedData = (selectedTab: TabType) => {
  const [recommendedArticle, setRecommendedArticle] = useState<Article[]>([]);
  const [recentArticle, setRecentArticle] = useState<Article[]>([]);
  const [isFetchingNewAriticles, setIsFetchingNewAriticles] =
    useState<boolean>(false);
  const [isFetchingNewRecentAriticles, setIsFetchingNewRecentAriticles] =
    useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);
  const [from, setFrom] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // 추천 피드 데이터 가져오기
  const {
    data: recommendedFeed,
    isLoading: isRecommendedFeedLoading,
    isFetching: isRecommendedFeedFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['recommendedFeed'],
    queryFn: getRecommendedFeed,
    enabled: false,
  });

  // 최신 피드 데이터 가져오기
  const {
    data: recentFeedData,
    isLoading: isRecentFeedLoading,
    isError: isRecentFeedError,
    error: recentFeedError,
    isFetching: isRecentFeedFetching,
    refetch: refetchRecentFeed,
  } = useQuery({
    queryKey: ['recentFeed'],
    queryFn: () => getRecentFeed(from),
    enabled: false,
  });

  // 추천 피드 데이터 업데이트
  useEffect(() => {
    if (recommendedFeed) {
      setRecommendedArticle(prev => {
        setIsFetchingNewAriticles(false);
        return mergeWithoutDuplicates(prev, recommendedFeed.data ?? []);
      });
    }
  }, [recommendedFeed, isRecommendedFeedFetching]);

  // 최신 피드 데이터 업데이트
  useEffect(() => {
    if (recentFeedData) {
      setRecentArticle(prev => {
        setIsFetchingNewRecentAriticles(false);
        return mergeWithoutDuplicates(prev, recentFeedData.articles ?? []);
      });
    }
  }, [recentFeedData, isRecentFeedFetching]);

  // 초기 데이터 로딩
  useEffect(() => {
    refetchRecentFeed();
    refetch();
  }, [refetchRecentFeed, refetch]);

  // from 값 변경 시 최신 피드 다시 가져오기
  useEffect(() => {
    if (from || from === null) {
      refetchRecentFeed();
    }
  }, [from, refetchRecentFeed]);

  // 새로고침 로직
  useEffect(() => {
    if (refreshing) {
      if (selectedTab === 'latest') {
        queryClient.invalidateQueries({queryKey: ['recentFeed', from]});
        setRecentArticle([]);
      } else {
        queryClient.invalidateQueries({queryKey: ['recommendedFeed']});
        setRecommendedArticle([]);
      }
    }
  }, [refreshing, selectedTab, from, queryClient]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      if (selectedTab === 'latest') {
        if (from === null) {
          refetchRecentFeed();
        } else {
          setFrom(null);
        }
      } else {
        refetch();
      }
      setRefreshing(false);
    }, 1000);
  };

  return {
    // 데이터
    recommendedArticle,
    recentArticle,
    recentFeedData,

    // 로딩 상태
    isRecommendedFeedLoading,
    isRecentFeedLoading,
    isFetchingNewAriticles,
    isFetchingNewRecentAriticles,
    refreshing,

    // 에러 상태
    isError,
    isRecentFeedError,
    error,
    recentFeedError,

    // 액션 함수
    handleRefresh,
    setFrom,
    setIsFetchingNewAriticles,
    setIsFetchingNewRecentAriticles,
    refetch,
  };
};
