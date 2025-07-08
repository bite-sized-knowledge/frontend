import React, {useCallback} from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  ViewToken,
} from 'react-native';
import {Article} from '@/types/Article';
import {FeedItem} from './FeedItem';
import {SkeletonCard} from '@/components/card/CardSkeleton';
import {EVENT_TYPE, sendEvent, TARGET_TYPE} from '@/api/eventApi';
import {BOTTOM_TAB_HEIGHT, HEADER_HEIGHT, screenHeight} from '.';
import {useTheme} from '@/context/ThemeContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type FeedListProps = {
  article: Article[];
  handleCardBodyClick: (data: string) => void;
  setBlogId: (id: string | null) => void;
  navigateToBlog: () => void;
  getNextData: () => void;
  isFetchingNewAriticles: boolean;
  setIsFetchingNewAriticles: React.Dispatch<React.SetStateAction<boolean>>;
  refreshing: boolean;
  handleRefresh: () => void;
  flatListRef: React.RefObject<FlatList>;
};

export const FeedList = ({
  article,
  handleCardBodyClick,
  setBlogId,
  navigateToBlog,
  getNextData,
  isFetchingNewAriticles,
  setIsFetchingNewAriticles,
  refreshing,
  handleRefresh,
  flatListRef,
}: FeedListProps) => {
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();

  const itemHeight =
    screenHeight -
    HEADER_HEIGHT -
    BOTTOM_TAB_HEIGHT -
    insets.top -
    insets.bottom;

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
        article.length - lastVisibleIndex <= 3 &&
        !isFetchingNewAriticles
      ) {
        setIsFetchingNewAriticles(true);
        getNextData();
      }
    },
    [
      article,
      isFetchingNewAriticles,
      getNextData,
      setBlogId,
      setIsFetchingNewAriticles,
    ],
  );

  return (
    <FlatList
      keyExtractor={item => item.id}
      data={article}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[theme.refreshIndicator]} // 안드로이드 전용
          tintColor={theme.refreshIndicator} // iOS 전용
        />
      }
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
      ref={flatListRef}
    />
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
