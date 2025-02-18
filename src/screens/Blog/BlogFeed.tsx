import React, {useCallback, useRef, useState} from 'react';
import {Dimensions, FlatList, StyleSheet, View, ViewToken} from 'react-native';
import {Card} from '@/components/card/Card';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useMutation} from '@tanstack/react-query';
import {useTheme} from '@/context/ThemeContext';
import CustomHeader from '@/components/common/CustomHeader';
import {WebViewDrawer} from '@/components/common/WebViewDrawer';
import {Article} from '@/types/Article';
import {SkeletonCard} from '@/components/card/CardSkeleton';
import {ROWS_PER_PAGE} from '.';
import {getBlogArticle} from '@/api/blogApi';

export const BOTTOM_TAB_HEIGHT = 56;
export const HEADER_HEIGHT = 64;
const screenHeight = Dimensions.get('window').height;

interface FeedItemProps {
  item: Article;
  handleCardBodyClick: (data: string) => void;
  handleCardHeaderClick?: (blog: string) => void;
}

const FeedItem = ({item, handleCardBodyClick}: FeedItemProps) => {
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
      />
    </View>
  );
};

export const BlogFeed: React.FC = ({route}) => {
  const flatListRef = useRef<FlatList>(null); // FlatList에 대한 ref
  const {totalArticles, currentIndex, next} = route.params;
  const [article, setArticle] = useState<Article[]>(totalArticles);
  const [visible, setVisible] = useState<boolean>(false);
  const [articleId, setArticleId] = useState<null | string>(null);
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();
  const blogId = totalArticles[0].blog.id;
  const [next2, setNext2] = useState<string | null>(next);
  const [isLoading, setIsLoading] = useState(false);

  const handleCardBodyClick = useCallback((data: string) => {
    setVisible(true);
    setArticleId(data);
  }, []);

  // 전체 아이템 높이를 계산 (피드 아이템과 스켈레톤 UI 모두 동일하게 사용)
  const itemHeight =
    screenHeight -
    HEADER_HEIGHT -
    BOTTOM_TAB_HEIGHT -
    insets.top -
    insets.bottom;

  const {mutate} = useMutation({
    mutationFn: () => getBlogArticle(blogId, ROWS_PER_PAGE, next2),
    onSuccess: newValue => {
      setArticle(prev => [
        ...prev,
        ...(newValue?.data?.articles.map(newArticle => {
          return {
            ...newArticle,
            blog: totalArticles[0].blog,
          };
        }) ?? []),
      ]);
      setNext2(newValue?.data?.next ?? null);
      setIsLoading(false);
    },
  });

  const onViewableItemsChanged = useCallback(
    ({viewableItems}: {viewableItems: Array<ViewToken<Article>>}) => {
      if (!viewableItems.length) {
        return;
      }

      const lastVisibleIndex = viewableItems[viewableItems.length - 1].index;

      if (
        lastVisibleIndex &&
        article.length - lastVisibleIndex <= 3 &&
        !isLoading
      ) {
        setIsLoading(true);
        mutate();
      }
    },
    [article.length, isLoading, mutate],
  );

  const onScrollToIndexFailed = (info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => {
    const wait = new Promise(resolve => setTimeout(resolve, 500));
    wait.then(() => {
      flatListRef.current?.scrollToIndex({index: info.index, animated: true});
    });
  };

  const getItemLayout = (_: unknown, index: number) => ({
    length: itemHeight, // 항목의 높이 (앞서 계산한 값 사용)
    offset: itemHeight * index, // 해당 항목의 위치
    index, // 인덱스 값
  });

  return (
    <View style={[styles.feeds, {backgroundColor: theme.background}]}>
      <CustomHeader title={totalArticles[0].blog.title} showBackButton={true} />
      <FlatList
        ref={flatListRef}
        keyExtractor={item => item.id}
        initialScrollIndex={currentIndex}
        data={article}
        getItemLayout={getItemLayout} // 항목의 위치를 계산해주는 함수 추가
        onScrollToIndexFailed={onScrollToIndexFailed} // Handling failure
        renderItem={({item}) => (
          <FeedItem item={item} handleCardBodyClick={handleCardBodyClick} />
        )}
        decelerationRate="fast"
        // 스크롤이 끝나면 스켈레톤 UI가 하단에 표시되어 새로운 데이터를 로딩 중임을 보여줍니다.
        ListFooterComponent={
          isLoading ? (
            <View
              style={[
                styles.feedSection,
                {height: itemHeight, backgroundColor: theme.background},
              ]}>
              <SkeletonCard />
            </View>
          ) : null
        }
        pagingEnabled={true}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
      />
      <WebViewDrawer
        visible={visible}
        onClose={() => setVisible(false)}
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
