import React, {useCallback, useEffect, useState} from 'react';
import {Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useQuery} from '@tanstack/react-query';
import {useTheme} from '@/context/ThemeContext';
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

  const [from, setFrom] = useState<string | null>(null);

  const [selectedTab, setSelectedTab] = useState<'latest' | 'recommend'>(
    'recommend',
  );

  const [refreshing, setRefreshing] = useState(false); // 새로고침 상태를 나타내는 상태 변수

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
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['recommendedFeed'],
    queryFn: getRecommendedFeed,
    enabled: selectedTab === 'recommend',
  });

  const {
    data: recentFeedData,
    // isLoading,
    // isError,
    // error,
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
  }, [recommendedFeed]);

  useEffect(() => {
    if (recentFeedData) {
      setRecentArticle(prev => {
        setIsFetchingNewRecentAriticles(false);
        return mergeWithoutDuplicates(prev, recentFeedData.articles ?? []);
      });
    }
  }, [recentFeedData]);

  const onWebViewClose = () => {
    setVisible(false);
    sendEvent(TARGET_TYPE.ARTICLE, articleId!, EVENT_TYPE.ARTICLE_OUT);
  };

  const handleRefresh = () => {
    // 새로고침 기능을 구현하는 함수
    setRefreshing(true);
    setTimeout(() => {
      if (selectedTab === 'latest') {
        setFrom(null);
      } else {
        refetch();
      }
      setRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    if (selectedTab === 'latest') {
      refetchRecentFeed();
    }
  }, [from, selectedTab, refetchRecentFeed]);

  // 로딩 중에는 피드 아이템과 동일한 레이아웃의 스켈레톤 UI들을 렌더링
  if (isLoading) {
    const skeletonItems = [1, 2, 3];
    return (
      <View style={[styles.feeds, {backgroundColor: theme.background}]}>
        <FeedHeader selectedTab={selectedTab} onPressTab={setSelectedTab} />
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

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.feeds, {backgroundColor: theme.background}]}>
      <FeedHeader selectedTab={selectedTab} onPressTab={setSelectedTab} />
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
