import React, {useCallback, useEffect, useState} from 'react';
import {Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '@/context/ThemeContext';
import {useFeedScroll} from '@/context/FeedScrollContext';
import {WebViewDrawer} from '@/components/common/WebViewDrawer';
import {SkeletonCard} from '@/components/card/CardSkeleton';
import {EVENT_TYPE, sendEvent, TARGET_TYPE} from '@/api/eventApi';
import {FeedHeader} from './Header';
import {FeedList} from './FeedList';
import {useFeedScrollManagement} from '@/hooks/useFeedScroll';
import {useFeedData} from '@/hooks/useFeedData';
import {useFeedTabs} from '@/hooks/useFeedTabs';

export const BOTTOM_TAB_HEIGHT = 56;
export const HEADER_HEIGHT = 64;
export const screenHeight = Dimensions.get('window').height;

const noop = () => {};

interface FeedProps {
  navigateToBlog: () => void;
  setBlogId: (id: string | null) => void;
}

export const Feed: React.FC<FeedProps> = ({navigateToBlog, setBlogId}) => {
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();
  const {registerScrollFunction} = useFeedScroll();

  const [visible, setVisible] = useState<boolean>(false);
  const [articleId, setArticleId] = useState<null | string>(null);

  // 스크롤 관리 훅
  const {
    recentFeedListRef,
    recommendedFeedListRef,
    handleScroll,
    restoreScrollPosition,
    scrollToTop,
  } = useFeedScrollManagement();

  // 탭 관리 훅
  const {selectedTab, handleTabPress} = useFeedTabs({
    onTabChange: tab => {
      restoreScrollPosition(tab);
    },
    onSameTabPress: tab => {
      scrollToTop(tab);
    },
  });

  // 피드 데이터 관리 훅
  const {
    recommendedArticle,
    recentArticle,
    recentFeedData,
    isRecommendedFeedLoading,
    isRecentFeedLoading,
    isFetchingNewAriticles,
    isFetchingNewRecentAriticles,
    refreshing,
    isError,
    isRecentFeedError,
    error,
    recentFeedError,
    handleRefresh,
    setFrom,
    setIsFetchingNewAriticles,
    setIsFetchingNewRecentAriticles,
    refetch,
  } = useFeedData(selectedTab);

  // 카드 클릭 핸들러
  const handleCardBodyClick = useCallback((data: string) => {
    setVisible(true);
    setArticleId(data);
    sendEvent(TARGET_TYPE.ARTICLE, data, EVENT_TYPE.ARTICLE_IN);
  }, []);

  // WebView 닫기 핸들러
  const onWebViewClose = useCallback(() => {
    setVisible(false);
    sendEvent(TARGET_TYPE.ARTICLE, articleId!, EVENT_TYPE.ARTICLE_OUT);
  }, [articleId]);

  // 스크롤 함수를 context에 등록
  useEffect(() => {
    const scrollFunction = () => {
      scrollToTop(selectedTab);
    };
    registerScrollFunction(scrollFunction);
  }, [selectedTab, registerScrollFunction, scrollToTop]);

  // 전체 아이템 높이 계산
  const itemHeight =
    screenHeight -
    HEADER_HEIGHT -
    BOTTOM_TAB_HEIGHT -
    insets.top -
    insets.bottom;

  // 로딩 상태 렌더링
  if (isRecommendedFeedLoading || isRecentFeedLoading || refreshing) {
    const skeletonItems = [1, 2, 3];
    return (
      <View style={[styles.feeds, {backgroundColor: theme.background}]}>
        <FeedHeader selectedTab={selectedTab} onPressTab={handleTabPress} />
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

  // 에러 상태 렌더링
  if (isError || isRecentFeedError) {
    return (
      <View style={styles.centered}>
        <Text>Error: {error?.message || recentFeedError?.message}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.feeds, {backgroundColor: theme.background}]}>
      <FeedHeader selectedTab={selectedTab} onPressTab={handleTabPress} />

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
