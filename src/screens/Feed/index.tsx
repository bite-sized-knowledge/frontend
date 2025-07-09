import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useTheme} from '@/context/ThemeContext';
import {useFeedScroll} from '@/context/FeedScrollContext';
import {getRecentFeed, getRecommendedFeed} from '@/api/feedApi';
import {WebViewDrawer} from '@/components/common/WebViewDrawer';
import {Article} from '@/types/Article';
import {SkeletonCard} from '@/components/card/CardSkeleton';
import {EVENT_TYPE, sendEvent, TARGET_TYPE} from '@/api/eventApi';
import {mergeWithoutDuplicates} from '@/util/utils';
import {FeedHeader} from './Header';
import {FeedList} from './FeedList';

export const BOTTOM_TAB_HEIGHT = 56;
export const HEADER_HEIGHT = 64;
export const screenHeight = Dimensions.get('window').height;

// 빈(no-op) 함수
const noop = () => {};

interface FeedProps {
  navigateToBlog: () => void;
  setBlogId: (id: string | null) => void;
}

export const Feed: React.FC<FeedProps> = ({navigateToBlog, setBlogId}) => {
  const [recommendedArticle, setRecommendedArticle] = useState<Article[]>([]);
  const [recentArticle, setRecentArticle] = useState<Article[]>([]);

  const [isFetchingNewAriticles, setIsFetchingNewAriticles] =
    useState<boolean>(false);
  const [isFetchingNewRecentAriticles, setIsFetchingNewRecentAriticles] =
    useState<boolean>(false);

  const [visible, setVisible] = useState<boolean>(false);
  const [articleId, setArticleId] = useState<null | string>(null);
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const [from, setFrom] = useState<string | null>(null);

  const [selectedTab, setSelectedTab] = useState<'latest' | 'recommend'>(
    'recommend',
  );

  const [refreshing, setRefreshing] = useState(false); // 새로고침 상태를 나타내는 상태 변수

  // 각 탭의 스크롤 위치를 저장하는 상태
  const [scrollPositions, setScrollPositions] = useState<{
    latest: number;
    recommend: number;
  }>({
    latest: 0,
    recommend: 0,
  });

  const handleCardBodyClick = useCallback((data: string) => {
    setVisible(true);
    setArticleId(data);
    sendEvent(TARGET_TYPE.ARTICLE, data, EVENT_TYPE.ARTICLE_IN);
  }, []);

  useEffect(() => {}, [visible]);

  // 전체 아이템 높이를 계산 (피드 아이템과 스켈레톤 UI 모두 동일하게 사용)
  const itemHeight =
    screenHeight -
    HEADER_HEIGHT -
    BOTTOM_TAB_HEIGHT -
    insets.top -
    insets.bottom;

  // React Query로 데이터 가져오기
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

  const {
    data: recentFeedData,
    isLoading: isRecentFeedLoading,
    isError: isRecentFeedError,
    error: recentFeedError,
    isFetching: isRecentFeedFetching,
    refetch: refetchRecentFeed,
  } = useQuery({
    queryKey: ['recentFeed', from],
    queryFn: () => getRecentFeed(from),
    enabled: false,
  });

  // 새로운 데이터가 로드되면 기존 데이터에 추가
  useEffect(() => {
    if (recommendedFeed) {
      setRecommendedArticle(prev => {
        setIsFetchingNewAriticles(false);
        return mergeWithoutDuplicates(prev, recommendedFeed.data ?? []);
      });
    }
  }, [recommendedFeed, isRecommendedFeedFetching]);

  useEffect(() => {
    if (recentFeedData) {
      setRecentArticle(prev => {
        setIsFetchingNewRecentAriticles(false);
        return mergeWithoutDuplicates(prev, recentFeedData.articles ?? []);
      });
    }
  }, [recentFeedData, isRecentFeedFetching]);

  const onWebViewClose = () => {
    setVisible(false);
    sendEvent(TARGET_TYPE.ARTICLE, articleId!, EVENT_TYPE.ARTICLE_OUT);
  };

  const recentFeedListRef = useRef<FlatList>(null);
  const recommendedFeedListRef = useRef<FlatList>(null);

  // 스크롤 위치를 실시간으로 저장하는 함수
  const handleScroll = (tab: 'latest' | 'recommend') => (offset: number) => {
    setScrollPositions(prev => ({
      ...prev,
      [tab]: offset,
    }));
  };

  // 현재 스크롤 위치를 저장하는 함수 (탭 변경 시 사용)
  const saveScrollPosition = (_tab: 'latest' | 'recommend') => {
    // 이미 handleScroll에서 실시간으로 저장되고 있으므로 별도 작업 불필요
  };

  // 저장된 스크롤 위치로 복원하는 함수
  const restoreScrollPosition = (tab: 'latest' | 'recommend') => {
    const ref = tab === 'latest' ? recentFeedListRef : recommendedFeedListRef;
    const savedPosition = scrollPositions[tab];

    setTimeout(() => {
      ref.current?.scrollToOffset({
        offset: savedPosition,
        animated: false,
      });
    }, 100);
  };

  const scrollToTop = (tab: 'latest' | 'recommend') => {
    if (tab === 'latest') {
      recentFeedListRef.current?.scrollToOffset({animated: true, offset: 0});
    } else if (tab === 'recommend') {
      recommendedFeedListRef.current?.scrollToOffset({
        animated: true,
        offset: 0,
      });
    }
    // 스크롤 위치를 0으로 업데이트
    setScrollPositions(prev => ({
      ...prev,
      [tab]: 0,
    }));
  };

  const {registerScrollFunction} = useFeedScroll();

  // 스크롤 함수를 context에 등록
  useEffect(() => {
    const scrollFunction = () => {
      if (selectedTab === 'latest') {
        recentFeedListRef.current?.scrollToOffset({animated: true, offset: 0});
      } else {
        recommendedFeedListRef.current?.scrollToOffset({
          animated: true,
          offset: 0,
        });
      }
    };
    registerScrollFunction(scrollFunction);
  }, [selectedTab, registerScrollFunction]);

  const onPressTab = (tab: 'latest' | 'recommend') => {
    if (selectedTab === tab) {
      // 같은 탭을 다시 누르면 맨 위로 스크롤
      scrollToTop(tab);
    } else {
      // 다른 탭을 누르면 현재 스크롤 위치를 저장하고 탭 변경
      saveScrollPosition(selectedTab);
      setSelectedTab(tab);
      // 새로운 탭의 스크롤 위치를 복원
      restoreScrollPosition(tab);
    }
  };

  const handleRefresh = () => {
    // 새로고침 기능을 구현하는 함수
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

  useEffect(() => {
    refetchRecentFeed();
    refetch();
  }, [refetchRecentFeed, refetch]);

  useEffect(() => {
    if (from || from === null) {
      refetchRecentFeed();
    }
  }, [from, refetchRecentFeed]);

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

  // 로딩 중에는 피드 아이템과 동일한 레이아웃의 스켈레톤 UI들을 렌더링
  if (isRecommendedFeedLoading || isRecentFeedLoading || refreshing) {
    const skeletonItems = [1, 2, 3];
    return (
      <View style={[styles.feeds, {backgroundColor: theme.background}]}>
        <FeedHeader selectedTab={selectedTab} onPressTab={onPressTab} />
        <FlatList
          data={skeletonItems}
          keyExtractor={item => item.toString()}
          renderItem={() => (
            <View
              style={[
                styles.feedSection,
                {height: itemHeight, backgroundColor: theme.background},
              ]}>
              <SkeletonCard />
            </View>
          )}
          pagingEnabled={true}
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={noop}
        />
      </View>
    );
  }

  if (isError || isRecentFeedError) {
    return (
      <View style={styles.centered}>
        <Text>Error: {error?.message || recentFeedError?.message}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.feeds, {backgroundColor: theme.background}]}>
      <FeedHeader selectedTab={selectedTab} onPressTab={onPressTab} />
      {selectedTab === 'latest' && (
        <FeedList
          article={recentArticle}
          handleCardBodyClick={handleCardBodyClick}
          setBlogId={setBlogId}
          navigateToBlog={navigateToBlog}
          getNextData={() => setFrom(recentFeedData?.next ?? null)}
          isFetchingNewAriticles={isFetchingNewRecentAriticles}
          setIsFetchingNewAriticles={setIsFetchingNewRecentAriticles}
          refreshing={refreshing}
          handleRefresh={handleRefresh}
          flatListRef={recentFeedListRef}
          onScroll={handleScroll('latest')}
        />
      )}
      {selectedTab === 'recommend' && (
        <FeedList
          article={recommendedArticle}
          handleCardBodyClick={handleCardBodyClick}
          setBlogId={setBlogId}
          navigateToBlog={navigateToBlog}
          getNextData={() => refetch()}
          isFetchingNewAriticles={isFetchingNewAriticles}
          setIsFetchingNewAriticles={setIsFetchingNewAriticles}
          refreshing={refreshing}
          handleRefresh={handleRefresh}
          flatListRef={recommendedFeedListRef}
          onScroll={handleScroll('recommend')}
        />
      )}
      <WebViewDrawer
        visible={visible}
        onClose={onWebViewClose}
        uri={articleId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  feeds: {flex: 1},
  feedSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  centered: {
    flex: 1,
  },
});
