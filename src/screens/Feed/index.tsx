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
import {getFeed} from '@/api/feedApi';
import CustomHeader from '@/components/common/CustomHeader';
import {WebViewDrawer} from '@/components/common/WebViewDrawer';
import {Article} from '@/types/Article';
import {SkeletonCard} from '@/components/card/CardSkeleton';

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
        {height: itemHeight, backgroundColor: theme.background},
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
  const [article, setArticle] = useState<Article[]>([]);
  const [isFetchingNewAriticles, setIsFetchingNewAriticles] =
    useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [link, setLink] = useState<null | string>(null);
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();

  const handleCardBodyClick = useCallback((data: string) => {
    setVisible(true);
    setLink(data);
  }, []);

  // 전체 아이템 높이를 계산 (피드 아이템과 스켈레톤 UI 모두 동일하게 사용)
  const itemHeight =
    screenHeight -
    HEADER_HEIGHT -
    BOTTOM_TAB_HEIGHT -
    insets.top -
    insets.bottom;

  // React Query로 데이터 가져오기
  const {data, isLoading, isError, error, refetch} = useQuery({
    queryKey: ['feed'],
    queryFn: getFeed,
  });

  // 새로운 데이터가 로드되면 기존 데이터에 추가
  useEffect(() => {
    if (data) {
      setArticle(prev => {
        setIsFetchingNewAriticles(false);
        return [...prev, ...(data?.data?.result ?? [])];
      });
    }
  }, [data]);

  const onViewableItemsChanged = useCallback(
    ({viewableItems}: {viewableItems: Array<ViewToken<Article>>}) => {
      if (!viewableItems.length) {
        setBlogId(null);
        return;
      }
      if (viewableItems[0].item) {
        setBlogId(viewableItems[0].item.blog.id);
      }

      const lastVisibleIndex = viewableItems[viewableItems.length - 1].index;

      if (
        lastVisibleIndex &&
        article.length - lastVisibleIndex <= 3 &&
        !isFetchingNewAriticles
      ) {
        setIsFetchingNewAriticles(true);
        refetch();
      }
    },
    [article, isFetchingNewAriticles, refetch, setBlogId],
  );

  // FlatList에 전달할 공통 props (onViewableItemsChanged는 항상 함수여야 함)
  const flatListProps = {
    pagingEnabled: true,
    showsVerticalScrollIndicator: false,
    onViewableItemsChanged: isLoading ? noop : onViewableItemsChanged,
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
          {...flatListProps}
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
      <CustomHeader title={'Feed'} />
      <FlatList
        keyExtractor={item => item.id}
        data={article}
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
        {...flatListProps}
      />
      <WebViewDrawer
        visible={visible}
        onClose={() => setVisible(false)}
        uri={link}
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
