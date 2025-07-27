import React, {useCallback, useEffect, useMemo} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {typography} from '../../styles/tokens/typography';
import CustomHeader from '@/components/common/CustomHeader';
import {useTheme} from '@/context/ThemeContext';
import {Article} from '@/types/Article';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useHistory} from '@/hooks/useHistory';
import {MY_SCREENS} from '@/types/constants/myScreens';
import {MiniCard} from '@/components/MiniCard';

export const ROWS_PER_PAGE = 10;

export interface ArticleWithPlaceholder extends Article {
  isPlaceholder?: boolean;
}

export const History = () => {
  const {theme} = useTheme();
  const navigation = useNavigation();

  const {
    data: newHistoryArticles,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useHistory();

  const isFocused = useIsFocused();

  // 화면이 포커스될 때만 재조회
  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused, refetch]);

  // pages 배열을 단일 배열로 펼치기
  const flatData = useMemo(() => {
    let data: ArticleWithPlaceholder[] =
      newHistoryArticles?.pages.flatMap(page => page?.articles ?? []) ?? [];

    if (data.length % 2 !== 0) {
      data.push({
        id: `${data.length + 1}`,
        isPlaceholder: true,
      } as ArticleWithPlaceholder);
    }
    return data;
  }, [newHistoryArticles]);

  // 끝에 다다르면 다음 페이지 요청
  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = ({
    item,
    index,
  }: {
    item: ArticleWithPlaceholder;
    index: number;
  }) => {
    return (
      <MiniCard
        key={index}
        article={item}
        isPlaceholder={item.isPlaceholder}
        onPress={() =>
          navigation.navigate(MY_SCREENS.HISTORY_FEED, {
            currentIndex: index,
          })
        }
      />
    );
  };

  return (
    <View style={{backgroundColor: theme.background, flex: 1}}>
      <CustomHeader title={'History'} showBackButton={false} />

      {flatData.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{gap: 4, alignItems: 'center'}}>
            <Text
              style={[typography.subHead, {color: theme.text, paddingTop: 42}]}>
              최근 본 글이 없어요.
            </Text>
            <Text style={[typography.label, {color: theme.text}]}>
              메인화면에서 여러 글을 확인해보세요!
            </Text>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.historySection}>
            <Text style={[typography.head, {color: theme.text}]}>
              최근 본 글
            </Text>
          </View>

          <FlatList
            keyExtractor={item => item.id}
            data={flatData}
            numColumns={2}
            contentContainerStyle={[styles.gap, {padding: 16}]}
            columnWrapperStyle={styles.gap}
            renderItem={renderItem}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.6}
            decelerationRate="fast"
            showsVerticalScrollIndicator={false} // 스크롤 표시 제거
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  historySection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  article: {
    minWidth: 160,
    minHeight: 160,
    borderRadius: 8,
    overflow: 'hidden',
  },
  articleImage: {
    width: '100%',
    height: 80,
    overflow: 'hidden',
  },
  articleTitle: {
    padding: 8,
    height: 68,
    justifyContent: 'center',
  },
  gap: {
    gap: 10,
  },
});
