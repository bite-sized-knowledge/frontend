import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from 'react-native';
import {Card} from '@/components/card/Card';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useQuery} from '@tanstack/react-query';
import {useTheme} from '@/context/ThemeContext';
import {getRecentFeed, getRecommendedFeed} from '@/api/feedApi';
import CustomHeader from '@/components/common/CustomHeader';
import {WebViewDrawer} from '@/components/common/WebViewDrawer';
import {Article} from '@/types/Article';
import {SkeletonCard} from '@/components/card/CardSkeleton';
import {EVENT_TYPE, sendEvent, TARGET_TYPE} from '@/api/eventApi';
import {mergeWithoutDuplicates} from '@/util/utils';
import {FeedHeader} from './Header';

export const BOTTOM_TAB_HEIGHT = 56;
export const HEADER_HEIGHT = 64;
const screenHeight = Dimensions.get('window').height;

// 빈(no-op) 함수
const noop = () => {};

interface FeedItemProps {
  item: Article;
  handleCardBodyClick: (data: string) => void;
  handleCardHeaderClick: (blog: string) => void;
}

const FeedItem = ({
  item,
  handleCardBodyClick,
  handleCardHeaderClick,
}: FeedItemProps) => {
  const insets = useSafeAreaInsets();
  const {theme} = useTheme();

  const itemHeight =
    screenHeight -
    HEADER_HEIGHT -
    BOTTOM_TAB_HEIGHT -
    insets.top -
    insets.bottom;

  return (
    <View
      style={[
        styles.feedSection,
        {
          height: itemHeight,
          backgroundColor: theme.background,
        },
      ]}>
      <Card
        article={{...item}}
        blog={item.blog}
        handleCardBodyClick={handleCardBodyClick}
        handleCardHeaderClick={handleCardHeaderClick}
      />
    </View>
  );
};

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
    'latest',
  );

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
    // refetch,
  } = useQuery({
    queryKey: ['recentFeed', from],
    queryFn: () => getRecentFeed(from),
    enabled: selectedTab === 'latest',
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

  const onViewableItemsChanged = useCallback(
    ({viewableItems}: {viewableItems: Array<ViewToken<Article>>}) => {
      if (!viewableItems.length) {
        setBlogId(null);
        return;
      }
      if (viewableItems[0].item) {
        setBlogId(viewableItems[0].item.blog.id);
      }

      sendEvent(
        TARGET_TYPE.ARTICLE,
        viewableItems[0].item.id,
        EVENT_TYPE.F_IMP,
      );

      const lastVisibleIndex = viewableItems[viewableItems.length - 1].index;

      if (
        lastVisibleIndex &&
        recommendedArticle.length - lastVisibleIndex <= 3 &&
        !isFetchingNewAriticles
      ) {
        setIsFetchingNewAriticles(true);
        refetch();
      }
    },
    [recommendedArticle, isFetchingNewAriticles, refetch, setBlogId],
  );

  const onViewableItemsChangedRecentArticle = useCallback(
    ({viewableItems}: {viewableItems: Array<ViewToken<Article>>}) => {
      if (!viewableItems.length) {
        setBlogId(null);
        return;
      }
      if (viewableItems[0].item) {
        setBlogId(viewableItems[0].item.blog.id);
      }

      sendEvent(
        TARGET_TYPE.ARTICLE,
        viewableItems[0].item.id,
        EVENT_TYPE.F_IMP,
      );

      const lastVisibleIndex = viewableItems[viewableItems.length - 1].index;

      if (
        lastVisibleIndex &&
        recentArticle.length - lastVisibleIndex <= 3 &&
        !isFetchingNewRecentAriticles
      ) {
        setIsFetchingNewRecentAriticles(true);
        setFrom(recentFeedData?.next ?? null);
      }
    },
    [recentArticle, isFetchingNewRecentAriticles, setBlogId, recentFeedData],
  );

  const onWebViewClose = () => {
    setVisible(false);
    sendEvent(TARGET_TYPE.ARTICLE, articleId!, EVENT_TYPE.ARTICLE_OUT);
  };

  // 로딩 중에는 피드 아이템과 동일한 레이아웃의 스켈레톤 UI들을 렌더링
  if (isLoading) {
    const skeletonItems = [1, 2, 3];
    return (
      <View style={[styles.feeds, {backgroundColor: theme.background}]}>
        <CustomHeader title={'Feed'} />
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
        <FlatList
          keyExtractor={item => item.id}
          data={recentArticle}
          renderItem={({item}) => (
            <FeedItem
              item={item}
              handleCardBodyClick={handleCardBodyClick}
              handleCardHeaderClick={() => {
                setBlogId(item.blog.id);
                navigateToBlog();
              }}
            />
          )}
          decelerationRate="fast"
          // 스크롤이 끝나면 스켈레톤 UI가 하단에 표시되어 새로운 데이터를 로딩 중임을 보여줍니다.
          ListFooterComponent={
            isFetchingNewAriticles ? (
              <View
                style={[
                  styles.feedSection,
                  {height: itemHeight, backgroundColor: theme.background},
                ]}>
                <SkeletonCard />
              </View>
            ) : null
          }
          snapToInterval={itemHeight}
          snapToAlignment="start"
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChangedRecentArticle}
          getItemLayout={(_, index) => ({
            length: itemHeight,
            offset: itemHeight * index,
            index,
          })}
        />
      )}
      {selectedTab === 'recommend' && (
        <FlatList
          keyExtractor={item => item.id}
          data={recommendedArticle}
          renderItem={({item}) => (
            <FeedItem
              item={item}
              handleCardBodyClick={handleCardBodyClick}
              handleCardHeaderClick={() => {
                setBlogId(item.blog.id);
                navigateToBlog();
              }}
            />
          )}
          decelerationRate="fast"
          // 스크롤이 끝나면 스켈레톤 UI가 하단에 표시되어 새로운 데이터를 로딩 중임을 보여줍니다.
          ListFooterComponent={
            isFetchingNewAriticles ? (
              <View
                style={[
                  styles.feedSection,
                  {height: itemHeight, backgroundColor: theme.background},
                ]}>
                <SkeletonCard />
              </View>
            ) : null
          }
          snapToInterval={itemHeight}
          snapToAlignment="start"
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          getItemLayout={(_, index) => ({
            length: itemHeight,
            offset: itemHeight * index,
            index,
          })}
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
